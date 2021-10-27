import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TimeService } from '../../shared/services/time.service';
import { TimeRow } from '../../shared/models/timeRow.model';

@Component({
  selector: 'app-hour-table-admin',
  templateUrl: './hour-table.component-recent-admin.html',
  styleUrls: ['./hour-table-recent.component-admin.css'],
  providers: []
})
export class HourTableRecentAdminComponent implements OnInit, OnDestroy {
  autoIntId: number;
  modalDataAvailable = false;
  modalTime: TimeRow = new TimeRow();
   // TODO: move to timeService
  @Input() times: TimeRow[] = [];

  constructor(private timeService: TimeService) {}

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
    }, 15000);
  }

  ngOnDestroy() {
    if (this.autoIntId) {
      clearInterval(this.autoIntId);
    }
  }

  updateTime(time: TimeRow) {
    this.timeService.onUpdateTime(time);
    this.timeService.loadRecentTimes();
    this.closeTimeModel();
  }

  deleteTime(time: TimeRow) {
    this.timeService.onDeleteTime(time);
    this.timeService.loadRecentTimes();
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
