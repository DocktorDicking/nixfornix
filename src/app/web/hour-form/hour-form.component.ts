import {Component, OnInit} from '@angular/core';
import {TimeRow} from '../../shared/models/timeRow.model';
import {TimeService} from '../../shared/services/time.service';

@Component({
  selector: 'app-hour-form',
  templateUrl: './hour-form.component.html',
  styleUrls: ['./hour-form.component.css'],
  providers: [TimeService]
})
export class HourFormComponent implements OnInit {
  time: TimeRow = new TimeRow();
  breaktimes = [0, 15, 30, 45, 60];

  getBreakName(num: number) {
    if (num === 0) {
      return 'Geen';
    } else {
      return String(num) + ' Minuten';
    }
  }

  constructor(private timeService: TimeService) {
  }

  ngOnInit() {
    this.timeService.resetTimeObj(this.time);
  }

}
