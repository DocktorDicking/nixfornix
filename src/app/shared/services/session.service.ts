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
  private DATA_SOURCE = {
    jim: 'welkom01',
    nico: 'welkom02',
    admin: 'admin',
    john: 'welkom'
  };

  /**
   * Will authenticate a user based on pw and email. Will set a localstorage item to remember pw/email.
   * The localstorage item will be valid for 30 days. After 30 days the user need to reauthenticate.
   * @param user User
   */
  public login(user: User) {
    if (!user.hasCredentials()) {
      return false;
    }

    if (localStorage.length > 0) {
      const authEmail = localStorage.getItem('auth_email');
      const authPassword = localStorage.getItem('auth_password');
      const authDate = localStorage.getItem('auth_date');
      if (authEmail && authPassword && authDate) {
        // TODO: Replace DATA_SOURCE with API call.
        if (this.dateDiffInDays(new Date(authDate), new Date()) < 30) {
          if (authEmail in this.DATA_SOURCE && (this.DATA_SOURCE[authEmail] === authPassword)) {
            sessionStorage.setItem('auth_email', authEmail);
            sessionStorage.setItem('auth_password', authPassword);
            return true;
          }
        } else {
          localStorage.removeItem('auth_email');
          localStorage.removeItem('auth_password');
          localStorage.removeItem('auth_date');
        }
      }
    }

    // TODO: Replace DATA_SOURCE with API call.
    if (user.email in this.DATA_SOURCE && (this.DATA_SOURCE[user.email] === user.password)) {
      sessionStorage.setItem('auth_email', user.email);
      sessionStorage.setItem('auth_password', user.password);
      user.admin = (user.email === 'admin'); // TODO: Remove before prod.

      // TODO: Stay logged in checkbox check here. (auth_auto)
      if (true) {
        localStorage.setItem('auth_date', new Date().toISOString());
        localStorage.setItem('auth_email', user.email);
        localStorage.setItem('auth_password', user.password);
      }
      return true;
    }
  }

  /**
   * Checks if a user is authenticated by checking session for auth variables.
   * If auth variables exist in session storage they will be evaluated.
   * @param user User
   */
  public isAuthenticated(user: User) {
    if (sessionStorage.length > 0) {
      const authEmail = sessionStorage.getItem('auth_email');
      const authPassword = sessionStorage.getItem('auth_password');
      if (authEmail && authPassword) {
        // TODO: Check if pw/email exist in db
        if (authEmail === user.email && authPassword === user.password) {
          return (authEmail in this.DATA_SOURCE && (this.DATA_SOURCE[authEmail] === authPassword));
        } else {
          sessionStorage.removeItem('auth_password');
          sessionStorage.removeItem('auth_email');
        }
        return false;
      }
    }
    return false;
  }

  /**
   * Will delete auth variables in sessionStorage and localStorage.
   */
  public logout() {
    if (sessionStorage.length > 0) {
      sessionStorage.removeItem('auth_email');
      sessionStorage.removeItem('auth_password');
    }
    if (localStorage.length > 0) {
      localStorage.removeItem('auth_email');
      localStorage.removeItem('auth_password');
      localStorage.removeItem('auth_date');
    }
  }

  /**
   * Returns difference between two dates in days.
   * Will use date 'a' as main.
   * @param a Date
   * @param b Date
   */
  public dateDiffInDays(a: Date, b: Date) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }
}
