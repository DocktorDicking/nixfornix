import { Component, OnInit } from '@angular/core';
import {TimeRow} from '../../shared/models/timeRow.mode';

@Component({
  selector: 'app-hour-form',
  templateUrl: './hour-form.component.html',
  styleUrls: ['./hour-form.component.css']
})
export class HourFormComponent implements OnInit {

  time: TimeRow = new TimeRow();

  times: Array<TimeRow> = [];

  onRegisterTime() {
    this.times.push(this.time);
  }

  constructor() { }

  ngOnInit() {
  }

}
