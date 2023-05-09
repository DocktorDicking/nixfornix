/**
 * Datamodel for timeRow. Used for hour registration and reading.
 */
import { User } from './user.model';

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
  approved: boolean;

  constructor() {
    this.description = '';
  }
}
