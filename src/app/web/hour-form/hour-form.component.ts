import {Component, OnInit} from '@angular/core';
import {TimeRow} from '../../shared/models/timeRow.model';
import {TimeService} from '../../shared/services/time.service';

@Component({
  selector: 'app-hour-form',
  templateUrl: './hour-form.component.html',
  styleUrls: ['./hour-form.component.css'],
  providers: []
})
export class HourFormComponent implements OnInit {
  private time: TimeRow;
  breaktimes = [0, 15, 30, 45, 60];

  submitTime() {
    this.timeService.onRegisterTime(this.time);
    this.time = this.timeService.newTimeObj();
  }

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
    this.time = this.timeService.newTimeObj();
  }

}
