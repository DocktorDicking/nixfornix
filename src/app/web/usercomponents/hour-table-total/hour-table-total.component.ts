import { Component, Input, OnInit } from '@angular/core';
import { TimeRow } from '../../../shared/models/timeRow.model';
import { TimeService } from '../../../shared/services/time.service';

@Component({
  selector: 'app-hour-table-total',
  templateUrl: './hour-table-total.component.html',
  styleUrls: ['./hour-table-total.component.css']
})
export class HourTableTotalComponent implements OnInit {
  modalDataAvailable = false;
  modalTime: TimeRow = new TimeRow();
  @Input() times: TimeRow[] = [];

  constructor(public timeService: TimeService) { }

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

  openTimeModal(time: TimeRow) {
    this.modalTime = Object.assign({}, time);
    this.modalDataAvailable = true;
  }

  closeTimeModel() {
    this.modalTime = new TimeRow();
    this.modalDataAvailable = false;
  }
}
