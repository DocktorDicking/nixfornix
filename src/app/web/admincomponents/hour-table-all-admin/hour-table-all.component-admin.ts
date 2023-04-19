import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TimeService} from '../../../shared/services/time.service';
import {TimeRow} from '../../../shared/models/timeRow.model';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {ExcelService} from '../../../shared/services/excel.service';

/*
TODO: make this less data intensive
- Fetch data per 3 months
- Add option (with warning) to fetch all data for the current year or all the data
- Save data in localstorage as a JSON blob and update when something is changed on the server? (Using some sort of update/version code)
 */

@Component({
  selector: 'app-hour-all-table-admin',
  templateUrl: './hour-table.component-all-admin.html',
  styleUrls: ['./hour-table-all.component-admin.css'],
  providers: []
})
export class HourTableAllAdminComponent implements OnInit, AfterViewInit, OnDestroy {
  public dtTablesDutch = { // TODO: Move this to a language class.
    processing: 'Laden...',
    search: 'Zoeken:',
    lengthMenu: '_MENU_ Items per pagina',
    info: '_START_ tot _END_ items zichtbaar op deze pagina van _TOTAL_ items.',
    infoEmpty: 'Geen items gevonden.',
    infoFiltered: '(Totaal _MAX_ items gefilterd)',
    infoPostFix: '',
    loadingRecords: 'Data laden...',
    zeroRecords: 'Geen items gevonden',
    emptyTable: 'Er zijn geen registraties gevonden...',
    paginate: {
      first: 'Eerste pagina',
      previous: 'Vorige pagina',
      next: 'Volgende pagina',
      last: 'Laatste pagina'
    },
    aria: {
      sortAscending: ': Sorteren oplopend',
      sortDescending: ': Sorteren aflopend'
    }
  };

  constructor(public timeService: TimeService, private toastr: ToastrService, private spinner: NgxSpinnerService,
              private xlsxService: ExcelService) {
  }

  // Datatable variables
  @ViewChild(DataTableDirective, {static: false}) dtDirective: DataTableDirective;
  public dtOptions: DataTables.Settings = {}; // Data-table settings, this is bound in the HTML on the <table> tag
  public dtTrigger: Subject<TimeRow> = new Subject<TimeRow>(); // Data-table object to control the renderer of the table

  // Modal variables
  public modalDataAvailable = false;
  public modalTime: TimeRow = new TimeRow();
  private _numNotApproved = 0;

  // TODO: change this to just an Array? Figure out what the hell that input annotation is actually doing...
  @Input() times: TimeRow[] = [];

  ngOnInit() {
    // Init options here according to DT docs.
    this.dtOptions = {
      pagingType: 'full_numbers',
      destroy: true,
      language: this.dtTablesDutch,
      order: [[1, 'desc']],
      stateSave: true,
      autoWidth: false,
      lengthMenu: [15, 30, 60, 120]
    };
    this.loadTimeData();
  }

  ngAfterViewInit() {
    this.dtTrigger.next(); // Inits the table so that dtDirective is a thing.
    this.rerender();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  /**
   * Reloads the table and renders it to the DOM. Got this from the datatables docs.
   */
  rerender(): void {
    this.dtDirective.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  thereAreTimes(): boolean {
    return this.times.length > 0;
  }

  updateTime(time: TimeRow) {
    this.spinner.show();
    this.timeService.onUpdateTime(time).then(res => {
      if (res.statusCode === 200) {
        this.loadTimeData();
        this.closeTimeModel();
        this.spinner.hide();
        this.toastr.success('De registratie van ' + time.user.name + ' is succesvol geüpdatet.', 'Registratie geüpdatet');
      } else {
        this.spinner.hide();
        this.toastr.error('Registratie kon niet worden geüpdatet.' +
          'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      }
    }).catch(err => {
      // Handled by HTTP interceptor.
      this.closeTimeModel();
      this.spinner.hide();
      this.toastr.error('Registratie kon niet worden geüpdatet.' +
        'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
    });
  }

  loadTimeData() {
    this.spinner.show();
    this.timeService.loadAllTimes().toPromise().then((timeData: TimeRow[]) => {
      this.times = timeData;
      this.rerender();
      this.spinner.hide();
    });
  }

  deleteTime(time: TimeRow) {
    this.spinner.show();
    this.timeService.onDeleteTime(time).then(res => {
      if (res.statusCode === 200) {
        this.loadTimeData();
        this.closeTimeModel();
        this.spinner.hide();
        this.toastr.success('De registratie van ' + time.user.name + ' is succesvol verwijderd.', 'Registratie verwijderd');
      } else {
        this.spinner.hide();
        this.toastr.error('Registratie kon niet worden verwijderd.' +
          'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden verwijderd');
      }
    }).catch(err => {
      this.closeTimeModel();
      this.spinner.hide();
      this.toastr.error('Registratie kon niet worden verwijderd.' +
        'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden verwijderd');
      // Handled by HTTP interceptor: ErrorInterceptor
    });
  }

  openTimeModal(time: TimeRow) {
    this.modalTime = Object.assign({}, time);
    this.modalDataAvailable = true;
  }

  closeTimeModel() {
    this.modalTime = new TimeRow();
    this.modalDataAvailable = false;
  }

  /**
   * Extracts the dataset currently presented in the datatable (after search).
   * TODO: Extracts the set from the datatable itself and will present the user with an Excel document to download.
   */
  dtExportData() {
    this.spinner.show('Exporteren...');

    // the data we want is inside this dtInstance
    this.dtDirective.dtInstance.then((dtInstance: DataTables.Api) => {

      // get the complete dataset[[*]] with the search applied.
      const dataObject = dtInstance.rows( { search: 'applied' } ).data();
      const objClone = {...dataObject};
      const asArray = Object.entries(objClone);

      // filter the dataset[[]], so we only have the rows that contain registration data, and not application data.
      const filtered = asArray
        .filter(([key]) => !isNaN(Number(key)))
        .map((array) => array[1]);

      // check last element for app data which needs to contain '<!--bindings...'
      filtered.forEach(array => {
        if (typeof array[array.length - 1] === 'string') {
          array[array.length - 1].includes('<!--') && array.pop();
        }
      });

      // sum a total of all working hours and add it to the sheet data.
      let totalHours = 0;
      filtered.forEach(array => totalHours += +array[5]);
      filtered.push(['Totaal', totalHours]);

      // Service will create the excel doc with the filtered data.
      this.xlsxService.generateExcel(filtered);

      this.spinner.hide();
    });
  }

  approveAll() {
    this.spinner.show(this.numNotApproved + ' Registraties updaten...');
    this.times.forEach(element => {
      if (!element.approved) {
        element.approved = true;
        this.timeService.onUpdateTime(element).then(res => {
          if (res.statusCode === 200) {
            // Do nothing
          } else {
            this.toastr.error('Registratie kon niet worden geüpdatet.' +
              'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
          }
        }).catch(err => {
            // Handled by HTTP interceptor.
          });
      }
    });
    this.toastr.success('', 'Registraties geaccodeerd.');
    this.spinner.hide();
  }

  /**
   * Loops al registrations if any and returns the number of registrations that are not approved.
   */
  calcNumNotApproved(): number {
    if (this.times.length > 0) {
      this.spinner.show();
      this._numNotApproved = 0;
      this.times.forEach(element => !element.approved && this._numNotApproved++);
      this.spinner.hide();
      return this._numNotApproved;
    }
    return this._numNotApproved;
  }

  get numNotApproved(): number {
    return this._numNotApproved;
  }
}
