// Service which holds all functionality for logging in.
import {Injectable} from '@angular/core';

/**
 * Handles all session related logic.
 */
@Injectable()
export class SessionService {

  /**
   * Adds a string as token to the sessionStore
   * @param token
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
   * @param token
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
  public havesSession(): boolean {
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
    if (this.havesSession()) {
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
}
