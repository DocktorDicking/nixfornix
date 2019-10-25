import {TimeRow} from '../models/timeRow.model';
import {EventEmitter} from '@angular/core';

export class TimeService {
  timesChanged = new EventEmitter<TimeRow[]>();
  private _times: TimeRow[] = [];
  private _defaultBreakTime = 30; // TODO: Move to settings file or something alike.
  private _defaultLocation = 'Luca Catering'; // TODO: Change to numeric value

  onRegisterTime(time: TimeRow) {
    const pushTime = new TimeRow();
    let newId = 1;
    const lastTimeRow = this._times[this._times.length - 1];

    if (typeof lastTimeRow !== 'undefined') {
      if (typeof lastTimeRow.id !== 'undefined') {
        newId = lastTimeRow.id + 1; // TODO: change id assignment when db is available.
      }
    }
    pushTime.id = newId;

    pushTime.cloneTimeRow(time);
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

  getOneTime(id: number): TimeRow {
    const time = new TimeRow();
    for (let timeRef of this._times) {
      if (Number(timeRef.id) === id) {

        return ;
      }

    }

    return time;
  }

  updateTime(id: number): boolean {return null;}

  deleteTime(id: number): boolean {return null;}




  // TODO: add function to calculate worked hours. And other CRUD functions.
}
