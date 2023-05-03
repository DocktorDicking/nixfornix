import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/services/state.service';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
import {SettingService} from '../shared/services/setting.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(public stateService: StateService, public authService: AuthService, public toastr: ToastrService,
              public settings: SettingService) { }
  public state: string;

  ngOnInit() {
    this.stateService.initialize(this.authService.currentUserValue);
    this.stateService.currentState.subscribe(currentState => this.state = currentState);

    // Welcome message
    const currentUser: User = this.authService.currentUserValue;
    const middleName = currentUser.middleName ? ' ' + currentUser.middleName + ' ' : ' ';
    const fullName = currentUser.name + middleName + currentUser.lastName;
    this.toastr.success('Welkom terug ' + fullName , 'Login succesvol');
  }
}
