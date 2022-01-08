import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from '../../../shared/services/time.service';
import {TimeRow} from '../../../shared/models/timeRow.model';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-hour-recent-table-admin',
  templateUrl: './hour-table.component-recent-admin.html',
  styleUrls: ['./hour-table-recent.component-admin.css'],
  providers: []
})
export class HourTableRecentAdminComponent implements OnInit, OnDestroy {
  public autoIntId: number;
  public modalDataAvailable = false;
  public modalTime: TimeRow = new TimeRow();
  // TODO: move to timeService
  @Input() times: TimeRow[] = [];

  constructor(public timeService: TimeService, private toastr: ToastrService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();
    this.timeService.loadRecentTimes();
    this.timeService.recentTimesChanged.subscribe(
      (newTimes: TimeRow[]) => {
        this.times = newTimes;
        this.spinner.hide();
      }
    );

    // Auto refresh list.
    this.autoIntId = setInterval(() => {
      this.timeService.autoLoadRecentTimes();
    }, 300000);
  }

  ngOnDestroy() {
    if (this.autoIntId) {
      clearInterval(this.autoIntId);
    }
  }

  updateTime(time: TimeRow) {
    this.spinner.show();
    this.timeService.onUpdateTime(time).then(res => {
      if (res.statusCode === 200) {
        this.timeService.loadRecentTimes();
        this.closeTimeModel();
        this.spinner.hide();
        this.toastr.success('De registratie van ' + time.user.name + ' is succesvol geüpdatet.', 'Registratie geüpdatet');
      } else {
        this.spinner.hide();
        this.toastr.error('Registratie kon niet worden geüpdatet.' +
          'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      }
    }).catch(err => {
      this.spinner.hide();
      this.toastr.error('Registratie kon niet worden geüpdatet.' +
        'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      // Handled by HTTP interceptor: ErrorInterceptor
    });
  }

  deleteTime(time: TimeRow) {
    this.spinner.show();
    this.timeService.onDeleteTime(time).then(res => {
      if (res.statusCode === 200) {
        this.timeService.loadRecentTimes();
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
}
