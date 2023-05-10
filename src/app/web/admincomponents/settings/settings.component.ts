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

}
