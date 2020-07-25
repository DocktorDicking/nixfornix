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
    if (this.sessionService.havesPersistentSession(user)) {
      this.sessionService.addSession(user);
      return true;
    }

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
  public authenticateAddPersistent(user: User) {
    if (this.isUserLoggedIn(user)) {
      this.sessionService.createPersistentSession(user);
    }
  }

  public isUserLoggedIn(user: User): boolean {
    return this.sessionService.havesSession(user);
  }

  /**
   * Destroys the active session.
   */
  public logout() {
    this.sessionService.destroySession();
    this.router.navigate(['./login']);
  }
}
