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
  private DATA_SOURCE = { // TODO: remove when we can call api.
    jim: 'welkom01',
    nico: 'welkom02',
    admin: 'admin',
    john: 'welkom'
  };

  constructor(private http: HttpClient, private sessionService: SessionService, private router: Router) {
  }

  /**
   * Authenticates the user by checking credentials. If the user is legit a session will be created.
   * This method also checks for a persistent session.
   * @param user User
   */
  public authenticate(user: User) {
    if (user.email in this.DATA_SOURCE && this.DATA_SOURCE[user.email] === user.password) {
      this.sessionService.addSession(user);
      return true;
    }
    return false;
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

  public getSession(): User {
    return this.sessionService.getSession();
  }

  public havesPersistentSession(): boolean {
    return this.sessionService.havesPersistentSession(this.sessionService.getPersistentUser());
  }

  public getPersistentUser(): User {
    return this.sessionService.getPersistentUser();
  }

  /**
   * Destroys the active session.
   */
  public logout() {
    this.sessionService.destroySession();
    if (this.havesPersistentSession()) {
      this.sessionService.destroyPersistentSession();
    }
    this.router.navigate(['./login']);
  }
}
