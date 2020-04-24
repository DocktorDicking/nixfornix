// Service which holds all functionality for logging in.
import {Injectable} from '@angular/core';
import {User} from '../models/user.model';

/**
 * Handles all session related logic.
 */
@Injectable()
export class SessionService {
  // Tmp array with user objects
  private users = {
    jim: 'welkom01',
    nico: 'welkom02',
    admin: 'admin',
    john: 'welkom'
  };

  public login(user: User) {
    if (!user.hasCredentials()) {
      return false;
    }
    user.admin = (user.email === 'admin');
    const data = this.users; // TODO: Replace this when we have a db.
    return (user.email in data && (data[user.email] === user.password));
  }
}
