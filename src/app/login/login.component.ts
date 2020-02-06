import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  users = {
    jim: 'welkom01',
    nico: 'welkom02',
    admin: 'admin'
  };

  canLogin: boolean;
  message: string;
  user = new User(null);

  /**
   * Will submit data from login form and check if credentials exist and match.
   */
  onSubmit() {
    this.canLogin = this.login(this.user);
    if (this.canLogin) {
      this.router.navigate(['./home']);
    } else if (this.message) {
      setTimeout(() => {
        this.message = undefined;  // TODO: Add directive to error msges and fadeout after 4 seconds.
      }, 5000);
    }
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  /**
   * This method need to be moved the the login service sometime.
   * @param user
   */
  private login(user: User) {
    if (!user.hasCredentials()) {
      return false;
    }

    // TODO: move to login service when backend haves database.
    const data = this.users;
    // @ts-ignore
    if (!user.username in data || !(data[user.username] === user.password)) {
      this.message = 'Gebruikersnaam of wachtwoord incorrect.'
      return false;
    } else {
      return true;
    }
  }
}
