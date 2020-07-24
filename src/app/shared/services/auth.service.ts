import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { SessionService } from './session.service';

/**
 * Handles all authentication related logic.
 */
@Injectable()
export class AuthService {
  private DATA_SOURCE = { // TODO: remove when we can call api.
    jim: 'welkom01',
    nico: 'welkom02',
    admin: 'admin',
    john: 'welkom'
  };

  constructor(private http: HttpClient, private sessionService: SessionService) {
  }

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

  public isUserLoggedIn(user: User): boolean {
    return this.sessionService.havesSession(user);
  }

  public logout() {
    this.sessionService.destroySession();
  }
}
