import {TimeRow} from '../models/timeRow.model';
import {EventEmitter} from '@angular/core';

export class TimeService {
  timesChanged = new EventEmitter<TimeRow[]>();
  private _times: TimeRow[] = [];
  private _defaultBreakTime = 30; // TODO: Move to settings file or something alike.
  private _defaultLocation = 'Luca Catering'; // TODO: Change to numeric value

  onRegisterTime(time: TimeRow) {
    const pushTime = new TimeRow();
    pushTime.location = time.location;
    pushTime.startTime = time.startTime;
    pushTime.stopTime = time.stopTime;
    pushTime.break = time.break;
    pushTime.date = time.date;
    pushTime.description = time.description;

    this._times.push(pushTime);
    this.timesChanged.emit(this._times);
  }

  newTimeObj(): TimeRow {
    const time = new TimeRow();
    time.break = String(this._defaultBreakTime);
    time.location = this._defaultLocation;
    return time;
  }

  get allTimes(): Array<TimeRow> {
    return this._times.slice(); // Slice returns a copy, so the source data cannot be changed.
  }

  // TODO: add function to calculate worked hours.
}
