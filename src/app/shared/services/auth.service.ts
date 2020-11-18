import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { SessionService } from './session.service';
import { Router } from '@angular/router';

/**
 * Handles all authentication related logic. Dependent on sessionService for session handling.
 */
@Injectable()
export class AuthService {
  private error = undefined;

  constructor(private http: HttpClient, private sessionService: SessionService, private router: Router) {
  }

  /*
  WIP
  Retrieve user from db when auth is successful and return or save in authserv?
   */
  public authenticate(user: User, persistent: boolean) {
    debugger; // TODO: WIP!!
    if (this.sessionService.havesPersistentSession()) {
      // get user?
    } else {
      this.login(user, persistent);
    }
  }

  private login(user: User, persistent: boolean) {
    let token;
    this.http.post<any>('/authenticate',
      {
        username: user.username,
        password: user.password,
        persist: persistent
      }).subscribe(data => {
      token = data.jwt;
    });

    if (token) {
      this.sessionService.addSession(token);
      return true;
    }
    return false;
  }

  public getToken() {
    // Get token from session/local storage
    return this.token;
  }

  /**
   * Creates a new persistent login for the user.
   * @param user User
   */
  public createPersistentSession() {
    // Save token to localstorage
    this.sessionService.addPersistentSession()
  }

  public havesSession(): boolean {
    // Check if a token is present and if the token is valid
    return this.sessionService.havesSession();
  }

  /**
   * Returns session variables in a user Object. Will return undefined if there is no session.
   */
  public getSession(): string {
    return this.sessionService.getSessionToken();
  }

  /**
   * Checks if there is a persistent session.
   */
  public havesPersistentSession(): boolean {
    // Token is present in local storage and the token is valid.
    return this.sessionService.havesPersistentSession(this.sessionService.getPersistentToken());
  }

  /**
   * Returns a user object based on variables stored for persistent login.
   */
  public getPersistentUser(): User {
    // Get persistent token?
    return this.sessionService.getPersistentToken();
  }

  /**
   * Destroys the active session and persistent session.
   */
  public logout() {
    this.sessionService.destroySession();
    if (this.havesPersistentSession()) {
      this.sessionService.destroyPersistentSession();
    }
    this.router.navigate(['login']);
  }
}
