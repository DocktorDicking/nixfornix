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
  private token = undefined;
  private error = undefined;

  constructor(private http: HttpClient, private sessionService: SessionService, private router: Router) {
  }

  /**
   * Authenticates the user by checking credentials. If the user is legit a session will be created.
   * This method also checks for a persistent session.
   * @param user User
   */
  public authenticate(user: User, persistent: boolean) {
    debugger; // TODO: WIP!! Fixed the CORS error and now for some reason username is not in request?? 24/10

    this.http.post<any>('/authenticate',
      {
        username: user.username,
        password: user.password,
        persist: persistent
      }).subscribe(data => {
        this.token = data.jwt;
    });

    return !!this.token;

    // if (user.email in this.DATA_SOURCE && this.DATA_SOURCE[user.email] === user.password) {
    //   this.sessionService.addSession(user);
    //   return true;
    // }
    // return false;
  }

  public getToken() {
    return this.token;
  }

  /**
   * Creates a new persistent login for the user.
   * @param user User
   */
  public createPersistentSession(user: User) {
    if (this.havesSession(user)) {
      this.sessionService.createPersistentSession(user);
    }
  }

  public havesSession(user: User): boolean {
    return this.sessionService.havesSession(user);
  }

  /**
   * Returns session variables in a user Object. Will return undefined if there is no session.
   */
  public getSession(): User {
    return this.sessionService.getSession();
  }

  /**
   * Checks if there is a persistent session.
   */
  public havesPersistentSession(): boolean {
    return this.sessionService.havesPersistentSession(this.sessionService.getPersistentUser());
  }

  /**
   * Returns a user object based on variables stored for persistent login.
   */
  public getPersistentUser(): User {
    return this.sessionService.getPersistentUser();
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
