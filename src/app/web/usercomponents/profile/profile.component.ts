import { Component, OnInit } from '@angular/core';
import {User} from '../../../shared/models/user.model';
import {AuthService} from '../../../shared/services/auth.service';
import {UserService} from '../../../shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public formUser: User;
  public newPassword: string;
  public hidePw = false;

  constructor(private authService: AuthService, public userService: UserService) { }

  ngOnInit() {
    this.formUser = this.authService.currentUserValue;
    this.newPassword = '';
  }

  toggleShowPw() {
    this.hidePw = !this.hidePw;
  }

  // TODO change both submits to new endpoint specifically designed for submitting profiles.
  submitProfile() {
    this.userService.update(this.formUser);
  }

  changePassword() {
    const tempUser: User = this.authService.currentUserValue;
    tempUser.password = this.newPassword;
    this.userService.update(tempUser);
  }

  setGeneratedPassword() {
    this.newPassword = this.authService.getGeneratedPassword();
  }
}
