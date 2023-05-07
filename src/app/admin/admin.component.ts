import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/services/state.service';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
import {SettingService} from '../shared/services/setting.service';
import {ActivatedRoute} from '@angular/router';
import {SettingModel} from '../shared/models/setting.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public state: string;
  private settingData: SettingModel[];
  private adminCanManageUsers = false;
  private adminCanRegisterTime = false;

  constructor(public stateService: StateService, public authService: AuthService, public toastr: ToastrService,
              private route: ActivatedRoute) {
    // Reads the settingData from the RouteResolver, see SettingDataResolver.
    this.route.data.subscribe(() => {
      this.settingData = this.route.snapshot.data.settingData;
    });
  }

  ngOnInit() {
    // Initializing setting vars. Cannot be done in template, result to null.
    this.settingData.forEach((setting) => {
      switch (setting.name) {
        case SettingService.ADMIN_MANAGE_USERS:
          // Cast from String to boolean using JSON
          this.adminCanManageUsers = JSON.parse(setting.value);
          break;
        case SettingService.ADMIN_REGISTER_TIME:
          // Cast from String to boolean using JSON
          this.adminCanRegisterTime = JSON.parse(setting.value);
          break;
      }
    });

    this.stateService.initialize(this.authService.currentUserValue, this.adminCanRegisterTime, this.adminCanManageUsers);
    this.stateService.currentState.subscribe(currentState => this.state = currentState);

    // Welcome message
    const currentUser: User = this.authService.currentUserValue;
    const middleName = currentUser.middleName ? ' ' + currentUser.middleName + ' ' : ' ';
    const fullName = currentUser.name + middleName + currentUser.lastName;
    this.toastr.success('Welkom terug ' + fullName , 'Login succesvol');
  }
}
