import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { SessionService } from '../shared/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  canLogin: boolean;
  message: string;
  user = new User(null);

  /**
   * Will submit data from login form and check if credentials exist and match.
   */
  onSubmit() {
    this.canLogin = this.sessionService.login(this.user);
    if (this.canLogin) {
      this.router.navigate(['./home']);
    } else {
      this.setMessage('Gebruikersnaam of wachtwoord incorrect.');
    }
  }

  constructor(private router: Router, private sessionService: SessionService) { }

  ngOnInit() {
  }

  private setMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = undefined;  // TODO: Add directive to error msges and fadeout after 4 seconds.
    }, 5000);
  }
}
