import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import {AuthService} from '../shared/services/auth.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  token: boolean;
  message: string;
  user = new User(null);
  persistentLogin: boolean;

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) { }

  /**
   * will check for persistent login on Init.
   */
  ngOnInit() {
    // debugger;
    this.persistentLogin = false; // default value
    if (this.authService.loginPersistent()) {
      this.user = this.authService.getSessionUser();
      this.login();
    }
  }

  /**
   * Will submit data from login form and check if credentials exist and match.
   */
  onSubmit() {
    debugger;
    if (typeof this.user.username !== 'undefined' && typeof this.user.password !== 'undefined') {
      if (this.authService.login(this.user, this.persistentLogin)) {
        this.user = this.authService.getSessionUser();
        this.login();
      } else {
        // this.setMessage('Gebruikersnaam of wachtwoord incorrect.'); // TODO: Add error msg from http
        this.setMessage(this.authService.getError());
      }
    }
  }

  private login() {
    if (this.user.admin) {
      this.router.navigate(['./admin']);
    } else {
      this.router.navigate(['./home']);
    }
  }

  private setMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = undefined;  // TODO: Add directive to error msges and fadeout after 4 seconds.
    }, 5000);
  }
}
