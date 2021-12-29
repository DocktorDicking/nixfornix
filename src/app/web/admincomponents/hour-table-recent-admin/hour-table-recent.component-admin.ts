import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from '../../../shared/services/time.service';
import {TimeRow} from '../../../shared/models/timeRow.model';
import {ToastrService} from 'ngx-toastr';

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

  constructor(public timeService: TimeService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.timeService.loadRecentTimes();
    this.timeService.recentTimesChanged.subscribe(
      (newTimes: TimeRow[]) => {
        this.times = newTimes;
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
    this.timeService.onUpdateTime(time).then(res => {
      if (res.statusCode === 200) {
        this.timeService.loadRecentTimes();
        this.closeTimeModel();
        this.toastr.success('De registratie van ' + time.user.name + ' is succesvol geüpdatet.', 'Registratie geüpdatet');
      } else {
        this.toastr.error('Registratie kon niet worden geüpdatet.' +
          'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      }
    }).catch(err => {
      this.toastr.error('Registratie kon niet worden geüpdatet.' +
        'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      // Handled by HTTP interceptor: ErrorInterceptor
    });
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
