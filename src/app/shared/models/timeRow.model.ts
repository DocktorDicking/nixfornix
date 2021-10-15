/**
 * Datamodel for timeRow. Used for hour registration and reading.
 */
import {User} from './user.model';

export class TimeRow {
  id: number;
  date: string;
  start: string;
  stop: string;
  breaktime: number;
  location: string;
  description: string;
  hour: number;
  createdAt: string;
  updatedAt: string;
  user: User;


  // TODO add user object here? (API also haves this, might be handy dandy)
  constructor() {
    this.description = '';
  }

  /**
   * Clones data of parameter time into this object. This will delete all previous data in this TimeRow.
   * @param time TimeRow
   */
  cloneTimeRow(time: TimeRow) {
    this.date = time.date;
    this.start = time.start;
    this.stop = time.stop;
    this.breaktime = time.breaktime;
    this.location = time.location;
    this.description = time.description;
    this.createdAt = time.createdAt;
    this.updatedAt = time.updatedAt;
    this.user = time.user;
  }
}
