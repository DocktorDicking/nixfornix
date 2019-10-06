import {Component, Input, OnInit} from '@angular/core';
import {TimeService} from '../../shared/services/time.service';
import {TimeRow} from '../../shared/models/timeRow.model';

@Component({
  selector: 'app-hour-table',
  templateUrl: './hour-table.component.html',
  styleUrls: ['./hour-table.component.css'],
  providers: []
})
export class HourTableComponent implements OnInit {
  @Input() times: TimeRow[];

  constructor(private timeService: TimeService) { }

  ngOnInit() {
    this.timeService.timesChanged.subscribe(
      (newTimes: TimeRow[]) => {
        this.times = newTimes;
      }
    );
  }

}
