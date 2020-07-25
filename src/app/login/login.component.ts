import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authenticated: boolean;
  message: string;
  user = new User(null);

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  /**
   * Will submit data from login form and check if credentials exist and match.
   */
  onSubmit() {
    // TODO: Delete for prod.
    if (this.user.email === 'admin') {
      this.user.admin = true;
    }

    this.authenticated = this.authService.authenticate(this.user);
    if (this.authenticated) {
      if (this.user.admin) {
        this.router.navigate(['./admin']);
      } else {
        this.router.navigate(['./home']);
      }
    } else {
      this.setMessage('Gebruikersnaam of wachtwoord incorrect.');
    }
  }

  private setMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = undefined;  // TODO: Add directive to error msges and fadeout after 4 seconds.
    }, 5000);
  }
}
