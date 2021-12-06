import {Component, Input, OnInit} from '@angular/core';
import {TimeService} from '../../../shared/services/time.service';
import {TimeRow} from '../../../shared/models/timeRow.model';

@Component({
  selector: 'app-hour-table',
  templateUrl: './hour-table.component-recent.html',
  styleUrls: ['./hour-table-recent.component.css'],
  providers: []
})
export class HourTableRecentComponent implements OnInit {
  @Input() times: TimeRow[] = [];

  constructor(private timeService: TimeService) { }

  ngOnInit() {
    this.timeService.loadRecentTimes();
    this.timeService.recentTimesChanged.subscribe(
      (newTimes: TimeRow[]) => {
        this.times = newTimes;
      }
    );
  }

}
