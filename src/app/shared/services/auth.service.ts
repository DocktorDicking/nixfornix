import {Injectable, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from '../models/user.model';
import { SessionService } from './session.service';
import { Router } from '@angular/router';

/**
 * Handles all authentication related logic. Dependent on sessionService for session handling.
 */
@Injectable()
export class AuthService {
  // TODO: FIX CORS problem with login. Create someting (interceptor?) to get api errors. sigh..

  constructor( private http: HttpClient, private sessionService: SessionService, private router: Router) {
  }

  public login(user: User, persistent: boolean) {
    let token;
    this.http.post<any>('/authenticate',
      {
        username: user.username,
        password: user.password,
        persist: persistent
      })
      .subscribe(
        (data) => {
        token = data.jwt;
        if (token) {
          if (persistent) {
            this.sessionService.addPersistentSession(token);
          }
          return this.loginSessionUser(token);
        }
      });

    return false;
  }

  public loginPersistent() {
    if (this.sessionService.havesPersistentSession()) {
      return this.loginSessionUser(this.sessionService.getPersistentToken());
    }
    return false;
  }

  private loginSessionUser(token: string) {
    this.sessionService.addSession(token);
    this.http.get<any>('/whoami')
      .subscribe(data => {
        const sessionUser = new User();
        sessionUser.id = data.id;
        sessionUser.name = data.name;
        sessionUser.middleName = data.middleName;
        sessionUser.lastName = data.lastName;
        sessionUser.username = data.username;
        sessionUser.email = data.email;
        sessionUser.admin = data.admin;
        this.sessionService.setSessionUser(sessionUser);
      });
    return true; // TODO: return true, only when 200 OK.
  }

  public getSessionUser() {
    return this.sessionService.getSessionUser();
  }

  public getToken() {
    // Get token from session storage
    return this.sessionService.getSessionToken();
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
    return this.sessionService.havesPersistentSession();
  }

  /**
   * Destroys the active session and persistent session.
   */
  public logout() {
    this.sessionService.setSessionUser(null);
    this.sessionService.destroySession();
    if (this.havesPersistentSession()) {
      this.sessionService.destroyPersistentSession();
    }
    this.router.navigate(['login']);
  }
}
