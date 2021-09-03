import { Component, Input, OnInit } from '@angular/core';
import { TimeRow } from '../../shared/models/timeRow.model';
import { TimeService } from '../../shared/services/time.service';

@Component({
  selector: 'app-hour-table-total',
  templateUrl: './hour-table-total.component.html',
  styleUrls: ['./hour-table-total.component.css']
})
export class HourTableTotalComponent implements OnInit {
  @Input() times: TimeRow[] = [];

  constructor(private timeService: TimeService) { }

  ngOnInit() {
    this.timeService.loadAllTimes();
    this.timeService.allTimesChanged.subscribe(
      (newTimes: TimeRow[]) => {
        this.times = newTimes;
      }
    );
  }
}
