import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';
import { MessageService } from '../shared/services/message.service';
import { DatabaseService } from '../shared/services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // showMessage = false;
  // Template uses this var to know when to display message.
  message: string;
  user = new User(null);
  persistentLogin: boolean;

  constructor(private router: Router, private messageService: MessageService,
              private databaseService: DatabaseService, private authService: AuthService) {
    // Sub to the message service
    this.persistentLogin = false;
    this.messageService.currentMessage.subscribe(message => {
      this.message = message;
      // this.messageTimeOut();
    });
  }

  /**
   * will check for persistent login on Init.
   */
  ngOnInit() {
    this.authService.persistLogin().then(() => {
      if (this.authService.currentUserValue) {
        this.login();
      }
    });
  }

  /**
   * Will submit data from login form and check if credentials exist and match.
   */
  onSubmit() {
    // Call auth
    if (this.user.username && this.user.password) {
      this.messageService.clearMessage();
      this.authService.login(this.user.username, this.user.password, this.persistentLogin).then(() => {
        this.authService.whoami().then(() => this.login());
      });
    }
  }

  /**
   * Will redirect user to the correct page.
   */
  private login() {
    if (this.authService.currentUserValue) {
      if (this.authService.currentUserValue.admin) {
        this.router.navigate(['./admin']);
      } else {
        this.router.navigate(['./home']);
      }
    }
  }
}
