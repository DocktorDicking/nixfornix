/**
 * Datamodel for timeRow. Used for hour registration and reading.
 */
export class TimeRow {
  private _date: string;
  private _startTime: string;
  private _stopTime: string;
  private _break: string;
  private _location: string;
  private _description: string;

  constructor() {}

  set date(value: string) {
    this._date = value;
  }

  set startTime(value: string) {
    this._startTime = value;
  }

  set stopTime(value: string) {
    this._stopTime = value;
  }

  set break(value: string) {
    this._break = value;
  }

  set location(value: string) {
    this._location = value;
  }

  set description(value: string) {
    this._description = value;
  }

  get date(): string {
    return this._date;
  }

  get startTime(): string {
    return this._startTime;
  }

  get stopTime(): string {
    return this._stopTime;
  }

  get break(): string {
    return this._break;
  }

  get location(): string {
    return this._location;
  }

  get description(): string {
    return this._description;
  }
}
