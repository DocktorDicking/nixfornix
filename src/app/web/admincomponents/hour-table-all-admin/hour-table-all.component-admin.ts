import { Component, Input, OnInit } from '@angular/core';
import { TimeService } from '../../../shared/services/time.service';
import { TimeRow } from '../../../shared/models/timeRow.model';

@Component({
  selector: 'app-hour-all-table-admin',
  templateUrl: './hour-table.component-all-admin.html',
  styleUrls: ['./hour-table-all.component-admin.css'],
  providers: []
})
export class HourTableAllAdminComponent implements OnInit {
  public dtTablesDutch = { // TODO: Move this to a language class.
    processing: 'Laden...',
    search: 'Zoeken:',
    lengthMenu: '_MENU_ Items per pagina',
    info: '_START_ tot _END_ items zichtbaar op deze pagina van _TOTAL_ items.',
    infoEmpty: 'Mostrando ningún elemento.',
    infoFiltered: '(filtrado _MAX_ elementos total)',
    infoPostFix: '',
    loadingRecords: 'Data laden...',
    zeroRecords: 'No se encontraron registros',
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

  constructor(public timeService: TimeService) {}

  public dtOptions: DataTables.Settings = {}; // Data table settings
  public modalDataAvailable = false;
  public modalTime: TimeRow = new TimeRow();
   // TODO: move to timeService
  @Input() times: TimeRow[] = [];

  ngOnInit() {
    // Init options here according to DT docs.
    this.dtOptions = {
      language: this.dtTablesDutch
    };

    this.timeService.loadAllTimes();
    this.timeService.allTimesChanged.subscribe(
      (newTimes: TimeRow[]) => {
        this.times = newTimes;
      }
    );
  }

  updateTime(time: TimeRow) {
    this.timeService.onUpdateTime(time);
    this.closeTimeModel();
  }

  deleteTime(time: TimeRow) {
    this.timeService.onDeleteTime(time);
    this.closeTimeModel();
  }

  openTimeModal(time: TimeRow) {
    this.modalTime = Object.assign({}, time);
    this.modalDataAvailable = true;
  }

  closeTimeModel() {
    this.modalTime = new TimeRow();
    this.modalDataAvailable = false;
  }
}
