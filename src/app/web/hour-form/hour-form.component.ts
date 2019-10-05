import {Component, OnInit} from '@angular/core';
import {TimeRow} from '../../shared/models/timeRow.model';

@Component({
  selector: 'app-hour-form',
  templateUrl: './hour-form.component.html',
  styleUrls: ['./hour-form.component.css']
})
export class HourFormComponent implements OnInit {
  time: TimeRow = new TimeRow();
  times: Array<TimeRow> = [];

  breaktimes = [0, 15, 30, 45, 60];
  defaultBreakTime = 30;
  defaultLocation = 'Luca Catering'; // TODO: Change to numeric value

  getBreakName(num: number) {
    if (num === 0) {
      return 'Geen';
    } else {
      return String(num) + ' Minuten';
    }
  }

  onRegisterTime() {
    this.times.push(this.time);
    this.resetTimeObj();
  }

  resetTimeObj() {
    this.time.date = null;
    this.time.startTime = null;
    this.time.stopTime = null;
    this.time.break = String(this.defaultBreakTime);
    this.time.location = this.defaultLocation;
    this.time.description = null;
  }

  constructor() {
  }

  ngOnInit() {
    this.time.break = String(this.defaultBreakTime);
    this.time.location = this.defaultLocation;
  }

}
