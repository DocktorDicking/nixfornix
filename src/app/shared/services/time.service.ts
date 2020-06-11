import {TimeRow} from '../models/timeRow.model';
import {EventEmitter} from '@angular/core';
import {User} from '../models/user.model';

export class TimeService {
  timesChanged = new EventEmitter<TimeRow[]>();
  private _times: TimeRow[] = [];
  private _defaultBreakTime = 30; // TODO: Move to settings file or something alike.
  private _defaultLocation = 'Luca Catering'; // TODO: Change to numeric value

  /**
   * Registered a time row.
   * TODO: Add logic to save to database.
   * @param time
   */
  onRegisterTime(time: TimeRow) {
    const pushTime = new TimeRow();
    let newId = 1;
    const lastTimeRow = this._times[this._times.length - 1];

    // TODO: change id assignment when db is available.
    if (typeof lastTimeRow !== 'undefined') {
      if (typeof lastTimeRow.id !== 'undefined') {
        newId = lastTimeRow.id + 1;
      }
    }
    pushTime.id = newId;

    pushTime.cloneTimeRow(time);
    this.calculateWorkedHours(pushTime);
    this._times.push(pushTime);
    this.timesChanged.emit(this._times);
  }

  /**
   * Returns a new time object.
   */
  newTimeObj(): TimeRow {
    const time = new TimeRow();
    time.break = this._defaultBreakTime;
    time.location = this._defaultLocation;
    return time;
  }

  calculateWorkedHours(time: TimeRow) {
    const splitStart = time.startTime.split(':', 2);
    const splitStop = time.stopTime.split(':', 2);

    // Create dateobjects
    const start = new Date(time.date);
    const end = new Date(time.date);
    start.setHours(parseInt(splitStart[0]) , parseInt(splitStart[1]));
    end.setHours(parseInt(splitStop[0]), parseInt(splitStop[1]));

    // If endtime is past midnight add a day to end
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    // @ts-ignore
    const diff = (end - start); // milliseconds
    let minutes = Math.floor(diff / 1000 / 60);
    minutes = minutes - time.break;
    time.hours = Math.floor((minutes / 60) * 100) / 100;
  }

  /**
   * Will return all times of a user.
   */
  getAllTimes(user: User): Array<TimeRow> { // TODO: Make this fetch data from a database
    return this._times.slice(); // Slice returns a copy, so the source data cannot be changed.
  }

  getOneTime(id: number): TimeRow {
    const time = new TimeRow();
    for (const timeRef of this._times) {
      if (Number(timeRef.id) === id) {

        return ;
      }

    }

    return time;
  }

  updateTime(id: number): boolean {return null; }

  deleteTime(id: number): boolean {return null; }


}
