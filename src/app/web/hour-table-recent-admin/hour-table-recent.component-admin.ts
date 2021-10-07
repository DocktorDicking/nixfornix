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
  modelTime: TimeRow = new TimeRow();
  loadModal = false;
  breaktimes = [0, 15, 30, 45, 60]; // TODO: move to timeService
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

  // TODO: move to timeservice
  getBreakName(num: number) {
    if (num === 0) {
      return 'Geen';
    } else {
      return String(num) + ' Minuten';
    }
  }

  openTimeModal(time: TimeRow) {
    this.modelTime = time;
    this.loadModal = true;
  }

  closeTimeModel() {
    this.loadModal = false;
    this.modelTime = new TimeRow();
  }
}
