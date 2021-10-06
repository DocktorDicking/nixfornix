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

  // TODO: CONTINUE HERE find some way to open component modal
  openTime(time: TimeRow) {
    // TODO: EVENT EMITTER that sends a signal to the hour-update component. hour-update c should be subscribed ot this emmitter
    alert('OPENTIME' + time.id);
  }
}
