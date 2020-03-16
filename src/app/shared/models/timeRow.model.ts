/**
 * Datamodel for timeRow. Used for hour registration and reading.
 */
export class TimeRow {
  private _id: number;
  private _date: string;
  private _startTime: string;
  private _stopTime: string;
  private _break: number;
  private _location: string;
  private _description: string;

  constructor() {}

  /**
   * Clones data of parameter time into this object. This will delete all previous data in this TimeRow.
   * @param time TimeRow
   */
  cloneTimeRow(time: TimeRow) {
    this._date = time.date;
    this._startTime = time.startTime;
    this._stopTime = time.stopTime;
    this._break = time.break;
    this._location = time.location;
    this._description = time.description;
  }

  set id(value: number) { // TODO: Make return boolean to check if value was correct? Does Angular have a build in mechanism for this?
    this._id = value;
  }

  set date(value: string) {
    this._date = value;
  }

  set startTime(value: string) {
    this._startTime = value;
  }

  set stopTime(value: string) {
    this._stopTime = value;
  }

  set break(value: number) {
    this._break = value;
  }

  set location(value: string) {
    this._location = value;
  }

  set description(value: string) {
    this._description = value;
  }

  get id(): number {
    return this._id;
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

  get break(): number {
    return this._break;
  }

  get location(): string {
    return this._location;
  }

  get description(): string {
    return this._description;
  }
}
