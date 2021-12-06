import { Component, OnInit } from '@angular/core';
import {User} from '../../../shared/models/user.model';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user: User;
  public hidePw = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.currentUserValue;
  }

  toggleShowPw() {
    this.hidePw = !this.hidePw;
  }

  submitProfile() {
    // TODO update call
  }

  changePassword() {
    // TODO update password
  }
}
