import {TimeRow} from '../models/timeRow.model';

export class TimeService {
  private _times: Array<TimeRow> = [];
  private _defaultBreakTime = 30; // TODO: Move to settings file or something alike.
  private _defaultLocation = 'Luca Catering'; // TODO: Change to numeric value

  onRegisterTime(time: TimeRow) {
    this._times.push(time);
    this.resetTimeObj(time);
  }

  resetTimeObj(time: TimeRow) {
    time.date = null;
    time.startTime = null;
    time.stopTime = null;
    time.break = String(this._defaultBreakTime);
    time.location = this._defaultLocation;
    time.description = null;
  }

  get allTimes(): Array<TimeRow> {
    return this._times;
  }
}
