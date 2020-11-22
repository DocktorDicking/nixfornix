import {Injectable, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from '../models/user.model';
import { SessionService } from './session.service';
import { Router } from '@angular/router';
import {stringify} from 'querystring';

/**
 * Handles all authentication related logic. Dependent on sessionService for session handling.
 */
@Injectable()
export class AuthService {

  constructor( private http: HttpClient, private sessionService: SessionService, private router: Router) {
  }

  // see: https://stackoverflow.com/questions/48119369/wait-for-http-request-to-complete-in-angular-4-service
  public login(user: User, persistent: boolean) {
   this.http.post<any>('/authenticate',
      {
        username: user.username,
        password: user.password,
        persist: persistent
      })
      .toPromise().then(data => {
      const token = data.jwt;
      if (token) {
        this.sessionService.addSession(token);
        if (persistent) {
          this.sessionService.addPersistentSession(token);
        }
      }
    });
debugger;
     if (this.sessionService.havesSessionToken()) {
      return this.loginSessionUser(this.sessionService.getSessionToken());
    }
    return false;
  }

  public loginPersistent() {
    if (this.sessionService.havesPersistentSession()) {
      return this.loginSessionUser(this.sessionService.getPersistentToken());
    }
    return false;
  }

  private loginSessionUser(token: string) {
    debugger;
    this.sessionService.addSession(token);
    this.http.get('/whoami').toPromise().then(data => {
      sessionStorage.setItem('auth_user', JSON.stringify(data));
    });
    const userObj: Array<any> = JSON.parse(sessionStorage.getItem('auth_user'));
    this.sessionService.setSessionUser(userObj);
    console.log(this.sessionService.getSessionUser());
    return true;
  }

// .subscribe((data) => {
// const sessionUser = new User();
// sessionUser.id = data.id;
// sessionUser.name = data.name;
// sessionUser.middleName = data.middleName;
// sessionUser.lastName = data.lastName;
// sessionUser.username = data.username;
// sessionUser.email = data.email;
// sessionUser.admin = data.admin;
// this.sessionService.setSessionUser(sessionUser);
  public getSessionUser() {
    return this.sessionService.getSessionUser();
  }

  public getToken() {
    // Get token from session storage
    return this.sessionService.getSessionToken();
  }

  public havesSession(): boolean {
    // Check if a token is present and if the token is valid
    return this.sessionService.havesSessionToken();
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
