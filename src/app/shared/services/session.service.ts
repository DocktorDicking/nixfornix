// Service which holds all functionality for logging in.
import {Injectable} from '@angular/core';
import {User} from '../models/user.model';

/**
 * TODO:
 *
 * Add timeStamps to sessions so sessions can expire?
 * Add an id to a session (sessionId) so we can indentify sessions for logging etc.
 */

/**
 * Handles all session related logic.
 */
@Injectable()
export class SessionService {
  // TODO: Make this actually do session stuff.

  /**
   * Adds a new session to the sessionStorage. Will update session when session variables exist.
   * @param user User
   */
  public addSession(user: User) {
    sessionStorage.setItem('auth_email', user.email);
    sessionStorage.setItem('auth_password', user.password);
    sessionStorage.setItem('auth_fullName', user.fullName);
  }

  /**
   * Removes session variables from sessionStorage.
   */
  public destroySession() {
    sessionStorage.removeItem('auth_email');
    sessionStorage.removeItem('auth_password');
    sessionStorage.removeItem('auth_fullName');
  }

  /**
   * Creates a persistent session using the localStorage
   * @param user User
   */
  public createPersistentSession(user: User) {
    localStorage.setItem('auth_date', new Date().toISOString());
    localStorage.setItem('auth_email', user.email);
    localStorage.setItem('auth_password', user.password);
    // TODO: Replace password with some sort of token, since we don't want to save passwords everywhere. Do we?
  }

  /**
   * Removes persistent session variables from localStorage.
   */
  public destroyPersistentSession() {
    localStorage.removeItem('auth_email');
    localStorage.removeItem('auth_password');
    localStorage.removeItem('auth_date');
  }

  /**
   * Checks if a user haves an active session
   * @param user User
   */
  public havesSession(user: User): boolean {
    if (sessionStorage.length > 0) {
      const authEmail = sessionStorage.getItem('auth_email');
      const authPassword = sessionStorage.getItem('auth_password');
      if (authEmail && authPassword) {
        return (authEmail === user.email && authPassword === user.password);
      }
      return false;
    }
    return false;
  }

  /**
   * Returns a user based on the session variables.
   */
  public getSession(): User {
    if (sessionStorage.length > 0) {
      const authEmail = sessionStorage.getItem('auth_email');
      const authPassword = sessionStorage.getItem('auth_password');
      if (authEmail && authPassword) {
        const sessionUser = new User();
        sessionUser.email = authEmail;
        sessionUser.password = authPassword;
        return sessionUser;
      }
    }
    return undefined;
  }

  /**
   * Checks if the user haves an persistent session.
   * @param user User
   */
  public havesPersistentSession(user: User): boolean {
    if (localStorage.length > 0) {
      const authEmail = localStorage.getItem('auth_email');
      const authPassword = localStorage.getItem('auth_password');
      const authDate = localStorage.getItem('auth_date');
      if (authEmail && authPassword && authDate) {
        // TODO: Replace DATA_SOURCE with API call.
        if (this.dateDiffInDays(new Date(authDate), new Date()) < 30) {
          return (authEmail === user.email && authPassword === user.password);
        } else {
          this.destroyPersistentSession();
          return false;
        }
      }
      return false;
    }
    return false;
  }

  public getPersistentUser(): User {
    const user = new User();
    user.email = localStorage.getItem('auth_email');
    user.password = localStorage.getItem('auth_password');
    return user;
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
