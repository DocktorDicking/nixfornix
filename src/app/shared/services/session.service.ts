// Service which holds all functionality for logging in.
import {Injectable} from '@angular/core';
import {User} from '../models/user.model';

/**
 * Handles all session related logic.
 */
@Injectable()
export class SessionService {
  // Tmp array with user objects
  private users = [];


  private login(user: User) {
    if (!user.hasCredentials()) {
      return false;
    }
    const data = this.users; // TODO: Replace this when we have a db.
    return (user.username in data || (data[user.username] === user.password));
  }
}
