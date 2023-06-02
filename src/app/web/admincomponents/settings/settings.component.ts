import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SettingModel} from '../../../shared/models/setting.model';
import {SettingService} from '../../../shared/services/setting.service';
import {LocationService} from '../../../shared/services/location.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';

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

  constructor(private route: ActivatedRoute, public locationService: LocationService, private settingService: SettingService,
              private toastr: ToastrService, private spinner: NgxSpinnerService) {
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
        //TODO remove logo from settings
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
   *
   * Guess we will do this. Save all settings at the same time since the one button "Save" makes it feel like we should
   * implement it like this.
   *
   * Spring api needs a DTO and this side needs to send the settings like "{settings: [1,2,3,4]}"
   * https://stackoverflow.com/questions/57557763/how-to-send-array-of-objects-in-spring-boot-post-request
   */
  public onSubmit() {
    // alert(this.getSettingData());

    if (this.validate()) {
      this.spinner.show();
      this.settingService.onUpdate(this.getSettingData()).then(res => {
        if (res.statusCode === 200) {
          //TODO: Load new data into route? Check when data is loaded.

          this.spinner.hide();
          this.toastr.success('Instellingen zijn opgeslagen.');
        } else {
          this.spinner.hide();
          this.toastr.error('De server kon de instellingen niet opslaan.');
        }
      }).catch(err => {
        this.spinner.hide();
        this.toastr.error('Error er ging iets fout: ' + err);
        // Handled by HTTP interceptor: ErrorInterceptor
      });
    }
  }

  private validate(): boolean {
    //TODO: Default breaktime must be in the 'possible breaktimes' array.

    if (!(Number.isFinite(this.defaultBreaktime))) {
      this.toastr.error('Validator error: Standaard pauze tijd is geen nummer.');
      return false;
    }
    if (!(Array.isArray(Array.from(this.breakTimes)))) {
      this.toastr.error('Validator error: Pauze tijden staat niet in een juist formaat: [1,2,3]');
      return false;
    }
    return true;
  }

  private getSettingData() {
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
          setting.value = JSON.stringify(this.adminManageUsers);
          break;
        case SettingService.MAX_USERS:
          setting.value = JSON.stringify(this.maxActiveUsers);
          break;
      }
    });

    // Return object with the property settings and stringify it so that a json string is returned.
    return {settings: this.settingData};
  }
}
