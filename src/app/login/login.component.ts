import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import {AuthService} from '../shared/services/auth.service';
import {MessageService} from '../shared/services/message.service';
import {SessionService} from '../shared/services/session.service';
import {DatabaseService} from '../shared/services/database.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showMessage = false; // Template uses this var to know when to display message.
  message: string;
  user = new User(null);
  persistentLogin: boolean;
  token: string;

  constructor(private router: Router, private messageService: MessageService, private sessionService: SessionService, private databaseService: DatabaseService) {
    // Sub to the message service
    this.persistentLogin = false;
    this.messageService.currentMessage.subscribe(message => {
      this.message = message;
      this.messageTimeOut();
    });
  }

  /**
   * will check for persistent login on Init.
   */
  ngOnInit() {
    if (this.sessionService.havesPersistentSession()) {
      // get user based on token
      // auth that user?
    }
  }

  /**
   * Will submit data from login form and check if credentials exist and match.
   */
  onSubmit() {
    debugger;
    // Call auth
    if (this.user.username && this.user.password) {
      this.databaseService.authenticate(this.user, this.persistentLogin).toPromise();

      this.databaseService.authenticate(this.user, this.persistentLogin).subscribe(value => {
        debugger;
        this.token = value.jwt;
        if (this.token) {
          sessionStorage.setItem('auth_token', this.token);
          if (this.persistentLogin) {
            localStorage.setItem('auth_token', this.token);
          }
          this.login();
        }
      });
    }
  }

  /**
   * Will redirect user to the correct page.
   */
  private login() {
    console.log(this.token);
    this.router.navigate(['./home']);

    // if (this.user.admin) {
    //   this.router.navigate(['./admin']);
    // } else {
    //   this.router.navigate(['./home']);
    // }
  }

  /**
   * Controls how long a message is visible.
   */
  private messageTimeOut() {
    this.showMessage = true;
    setTimeout(() => {
      this.messageService.clearMessage();
    }, 7500);
  }
}
