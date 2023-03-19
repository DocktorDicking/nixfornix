import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';
import { MessageService } from '../shared/services/message.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public message: string;
  public user = new User(null);
  public persistentLogin: boolean;
  public hidePw = true;

  constructor(private router: Router, public messageService: MessageService,
              public authService: AuthService, private spinner: NgxSpinnerService) {
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
    this.messageService.clearMessage();
    if (this.authService.persistLogin()) {
      this.authService.whoami().then(() => {
        if (this.authService.currentUserValue) {
          this.login();
        }
      });
    }
  }

  /**
   * Will submit data from login form and check if credentials exist and match.
   */
  onSubmit() {
    // Call auth
    if (this.user.username && this.user.password) {
      this.spinner.show();
      this.messageService.clearMessage();
      this.authService.login(this.user.username, this.user.password, this.persistentLogin).then(() => {
        if (this.authService.currentTokenValue) {
          this.authService.whoami().then(() => this.login());
        }
      });
      this.spinner.hide();
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

  toggleShowPw() {
    this.hidePw = !this.hidePw;
  }
}
