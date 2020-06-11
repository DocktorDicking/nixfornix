/**
 * Datamodel for timeRow. Used for hour registration and reading.
 */
export class TimeRow {
  id: number;
  date: string;
  startTime: string;
  stopTime: string;
  break: number;
  location: string;
  description: string;
  hours: number;

  constructor() {}

  /**
   * Clones data of parameter time into this object. This will delete all previous data in this TimeRow.
   * @param time TimeRow
   */
  cloneTimeRow(time: TimeRow) {
    this.date = time.date;
    this.startTime = time.startTime;
    this.stopTime = time.stopTime;
    this.break = time.break;
    this.location = time.location;
    this.description = time.description;
  }
}
