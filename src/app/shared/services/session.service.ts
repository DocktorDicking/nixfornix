// Service which holds all functionality for logging in.
import {Injectable} from '@angular/core';
import {User} from '../models/user.model';

/**
 * Handles all session related logic.
 */
@Injectable()
export class SessionService {
  // TODO: Plan for now is to replace this with authService

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
    if (user.email in data && (data[user.email] === user.password)) {
      sessionStorage.setItem('auth_email', user.email);
      sessionStorage.setItem('auth_password', user.password);
      sessionStorage.setItem('auth_date', new Date().toISOString());
      return true;
    }
  }

  public logout() {
    if (sessionStorage.length > 0) {
      sessionStorage.removeItem('auth_email');
      sessionStorage.removeItem('auth_password');
      sessionStorage.removeItem('auth_date');
    }
  }

  public dateDiffInDays(a: Date, b: Date) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }
}
