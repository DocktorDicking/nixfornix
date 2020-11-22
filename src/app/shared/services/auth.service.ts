import {Injectable, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from '../models/user.model';
import { SessionService } from './session.service';
import { Router } from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

/**
 * Handles all authentication related logic. Dependent on sessionService for session handling.
 */
@Injectable()
export class AuthService {
  // Check: https://jasonwatmore.com/post/2019/06/10/angular-8-user-registration-and-login-example-tutorial

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  private currentTokenSubject: BehaviorSubject<string>;
  public currentToken: Observable<string>;

  constructor( private http: HttpClient, private sessionService: SessionService, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('auth_user')));
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentTokenSubject = new BehaviorSubject<string>(JSON.parse(sessionStorage.getItem('auth_token')));
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // see: https://stackoverflow.com/questions/48119369/wait-for-http-request-to-complete-in-angular-4-service
  login(username: string, password: string, persist: boolean) {
   return this.http.post<any>('/authenticate',
      {
        username,
        password,
        persist
      }).pipe(map(data => {
        sessionStorage.setItem('auth_token', JSON.stringify(data.jwt));
        this.currentTokenSubject.next(data.jwt);
        return data.jwt;
   }));
  }

  /**
   * Destroys the active session and persistent session.
   */
  public logout() {
    sessionStorage.re
    this.router.navigate(['login']);
  }
}
