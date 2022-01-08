import {Component, Input, OnInit} from '@angular/core';
import {TimeService} from '../../../shared/services/time.service';
import {TimeRow} from '../../../shared/models/timeRow.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-hour-table',
  templateUrl: './hour-table.component-recent.html',
  styleUrls: ['./hour-table-recent.component.css'],
  providers: []
})
export class HourTableRecentComponent implements OnInit {
  @Input() times: TimeRow[] = [];

  constructor(private timeService: TimeService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();
    this.timeService.loadRecentTimes();
    this.timeService.recentTimesChanged.subscribe(
      (newTimes: TimeRow[]) => {
        this.times = newTimes;
      }
    );

    // TODO: TMP dirty adhesive bandage. Rewrite the loadrecent times so we get a promise here.
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

}
