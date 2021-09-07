import { Component, Input, OnInit } from '@angular/core';
import { TimeService } from '../../shared/services/time.service';
import { TimeRow } from '../../shared/models/timeRow.model';

@Component({
  selector: 'app-hour-table-admin',
  templateUrl: './hour-table.component-recent-admin.html',
  styleUrls: ['./hour-table-recent.component-admin.css'],
  providers: []
})
export class HourTableRecentAdminComponent implements OnInit {
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
