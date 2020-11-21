import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import {AuthService} from '../shared/services/auth.service';
import {MessageService} from '../shared/services/message.service';

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

  constructor(private router: Router, private authService: AuthService, private messageService: MessageService) {
    // Sub to the message service
    this.messageService.currentMessage.subscribe(message => {
      this.message = message;
      this.messageTimeOut();
    });
  }

  /**
   * will check for persistent login on Init.
   */
  ngOnInit() {
    this.persistentLogin = false; // default value
    if (this.authService.loginPersistent()) {
      this.user = this.authService.getSessionUser(); // Needs to move to a service or get it after redirect
      this.login();
    }
  }

  /**
   * Will submit data from login form and check if credentials exist and match.
   */
  onSubmit() {
    if (typeof this.user.username !== 'undefined' && typeof this.user.password !== 'undefined') {
      if (this.authService.login(this.user, this.persistentLogin)) {
        this.user = this.authService.getSessionUser();
        this.login();
      }
    }
  }

  /**
   * Will redirect user to the correct page.
   */
  private login() {
    if (this.user.admin) {
      this.router.navigate(['./admin']);
    } else {
      this.router.navigate(['./home']);
    }
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
