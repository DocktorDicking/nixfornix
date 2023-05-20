import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SettingModel} from '../../../shared/models/setting.model';
import {SettingService} from '../../../shared/services/setting.service';
import {LocationService} from '../../../shared/services/location.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  private settingData: SettingModel[];

  public logo = '';
  public defaultBreaktime: number;
  public breakTimes: number[];
  public defaultLocation: string;
  public adminRegisterTime: boolean;
  public adminManageUsers: boolean;
  public maxActiveUsers: number;

  constructor(private route: ActivatedRoute, private locationService: LocationService) {
    this.locationService.getLocations();

    // Reads the settingData from the RouteResolver, see SettingDataResolver.
    this.route.data.subscribe(() => {
      this.settingData = this.route.snapshot.data.settingData;
    });
  }

  ngOnInit() {
    // Initializing setting vars.
    this.settingData.forEach((setting) => {
      switch (setting.name) {
        case SettingService.LOGO:
          this.logo = setting.value;
          break;
        case SettingService.DEFAULT_BREAKTIME:
          this.defaultBreaktime = JSON.parse(setting.value);
          break;
        case SettingService.BREAKTIMES:
          this.breakTimes = JSON.parse(setting.value);
          break;
        case SettingService.DEFAULT_LOCATION:
          this.defaultLocation = setting.value;
          break;
        case SettingService.ADMIN_REGISTER_TIME:
          this.adminRegisterTime = JSON.parse(setting.value);
          break;
        case SettingService.ADMIN_MANAGE_USERS:
          this.adminManageUsers = JSON.parse(setting.value);
          break;
        case SettingService.MAX_USERS:
          this.maxActiveUsers = JSON.parse(setting.value);
          break;
      }
    });
  }

  //TODO: CONTINUE HERE. Not entirely sure how to go about this. Still in the process of "designing"
  /**
   * Might be best to check what setting is changed on submit and only encode those and send a http request for each setting
   * changed.
   */

  public onSubmit() {
    if (this.validate()) {
      this.encode();
      //submit to api
      alert('SUBMIT!');
    }
    alert('Retry!');
  }

  private validate(): boolean {
    if (!(Number.isFinite(this.defaultBreaktime))) {
      alert("Input error: [Insert usefull text]");
      return false;
    }
    if (!(Array.isArray(Array.from(this.breakTimes)))) {
      alert("Input error: [Insert usefull text]");
      return false;
    }
    return true;
  }

  private encode() {
    this.settingData.forEach((setting) => {
      switch (setting.name) {
        case SettingService.LOGO:
          setting.value = this.logo;
          break;
        case SettingService.DEFAULT_BREAKTIME:
          setting.value = JSON.stringify(this.defaultBreaktime);
          break;
        case SettingService.BREAKTIMES:
          setting.value = JSON.stringify(this.breakTimes);
          break;
        case SettingService.DEFAULT_LOCATION:
          setting.value = this.defaultLocation;
          break;
        case SettingService.ADMIN_REGISTER_TIME:
          setting.value = JSON.stringify(this.adminRegisterTime);
          break;
        case SettingService.ADMIN_MANAGE_USERS:
          this.adminManageUsers = JSON.parse(setting.value);
          break;
        case SettingService.MAX_USERS:
          this.maxActiveUsers = JSON.parse(setting.value);
          break;
      }
    });

    //JSON encode variables and set setting objects.
  }
}
