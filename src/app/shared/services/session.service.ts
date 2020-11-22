// Service which holds all functionality for logging in.
import {Injectable} from '@angular/core';
import { User } from '../models/user.model';

/**
 * Handles all session related logic.
 * TODO: Maybe delete this whole thing because it feels like an extra step.
 */
@Injectable()
export class SessionService {
  private sessionUser: User;

  /**
   * Adds a string as token to the sessionStore
   */
  public addSession(token: string) {
    sessionStorage.setItem('auth_token', token);
  }

  /**
   * Removes an existing token from the sessionStore
   */
  public destroySession() {
    sessionStorage.removeItem('auth_token');
  }

  /**
   * Adds a string as token to the localStore
   */
  public addPersistentSession(token: string) {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Removes an existing token from the localStore
   */
  public destroyPersistentSession() {
    localStorage.removeItem('auth_token');
  }

  /**
   * Checks if there is a possible token in the sessionStore
   */
  public havesSessionToken(): boolean {
    if (sessionStorage.length > 0) {
      const token = sessionStorage.getItem('auth_token');
      if (typeof token !== 'undefined') {
        return true;
      }
    }
    return false;
  }

  /**
   * Tries to retrieve a token from the sessionStore. Returns null if there is no token.
   */
  public getSessionToken(): string {
    if (this.havesSessionToken()) {
      return sessionStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Checks if there is a possible token in de localStore
   */
  public havesPersistentSession(): boolean {
    if (localStorage.length > 0) {
      const token = localStorage.getItem('auth_token');
      if (typeof token !== 'undefined') {
        return true;
      }
    }
    return false;
  }

  /**
   * Tries to retrieve a token from the localStore. Returns null if there is no token.
   */
  public getPersistentToken(): string {
    if (this.havesPersistentSession()) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Set's the session user object.
   */
  public setSessionUser(data: any) {
    const sessionUser = new User();
    sessionUser.id = data.id;
    sessionUser.name = data.name;
    sessionUser.middleName = data.middleName;
    sessionUser.lastName = data.lastName;
    sessionUser.username = data.username;
    sessionUser.email = data.email;
    sessionUser.admin = data.admin;
    this.sessionUser = new User(null, sessionUser);
  }

  public getSessionUser(): User {
    return this.sessionUser;
  }
}
