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
  public modalDataAvailable = false;
  public modalTime: TimeRow = new TimeRow();
   // TODO: move to timeService
  @Input() times: TimeRow[] = [];

  constructor(public timeService: TimeService) {}

  ngOnInit() {
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
