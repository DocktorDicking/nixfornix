import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SettingModel} from '../../../shared/models/setting.model';
import {SettingService} from '../../../shared/services/setting.service';
import {LocationService} from '../../../shared/services/location.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  private settingData: SettingModel[];
  public settingCache: {[key: string]: any} = {};

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
        case SettingService.DEFAULT_BREAKTIME:
          this.settingCache[SettingService.DEFAULT_BREAKTIME] = JSON.parse(setting.value);
          break;
        case SettingService.BREAKTIMES:
          this.settingCache[SettingService.BREAKTIMES] = setting.value;
          break;
        case SettingService.DEFAULT_LOCATION:
          this.settingCache[SettingService.DEFAULT_LOCATION] = setting.value;
          break;
        case SettingService.ADMIN_REGISTER_TIME:
          this.settingCache[SettingService.ADMIN_REGISTER_TIME] = JSON.parse(setting.value);
          break;
        case SettingService.ADMIN_MANAGE_USERS:
          this.settingCache[SettingService.ADMIN_MANAGE_USERS] = JSON.parse(setting.value);
          break;
        case SettingService.MAX_USERS:
          this.settingCache[SettingService.MAX_USERS] = JSON.parse(setting.value);
          break;
        case SettingService.LICENSE_DATE:
          this.settingCache[SettingService.LICENSE_DATE] = setting.value;
          break;
        case SettingService.TABLE_SHOW_COL_APPROVED:
          this.settingCache[SettingService.TABLE_SHOW_COL_APPROVED] = JSON.parse(setting.value);
          break;
        case SettingService.TABLE_SHOW_COL_DESCRIPTION:
          this.settingCache[SettingService.TABLE_SHOW_COL_DESCRIPTION] = JSON.parse(setting.value);
          break;
        case SettingService.TABLE_SHOW_COL_LOCATION:
          this.settingCache[SettingService.TABLE_SHOW_COL_LOCATION] = JSON.parse(setting.value);
          break;
        case SettingService.TABLE_SHOW_COL_EMPLOYEE:
          this.settingCache[SettingService.TABLE_SHOW_COL_EMPLOYEE] = JSON.parse(setting.value);
          break;
      }
    });
  }

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
    if (this.validate()) {
      this.spinner.show();
      this.settingService.onUpdate(this.getSettingData()).then(res => {
        if (res.statusCode === 200) {
          // TODO: Load new data into route? Check when data is loaded.

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
    // We have to parse since the input field adds String quotes to this.
    const btArray = JSON.parse(this.settingCache[SettingService.BREAKTIMES]);

    // Validate if breakTimes is an array
    try {
      if (!(Array.isArray(btArray))) {
        this.toastr.error('Validator error: Pauze tijden staat niet in een juist formaat: [1,2,3]');
        return false;
      }
    } catch (e) {
      this.toastr.error('Validator error: Pauze tijden staat niet in een juist formaat: [1,2,3]');
      return false;
    }

    // Validate default breaktime and check if it is in the array of breakTimes.
    const defaultBreaktime = JSON.parse(this.settingCache[SettingService.DEFAULT_BREAKTIME]);
    if (!(Number.isFinite(defaultBreaktime))) {
      this.toastr.error('Validator error: Standaard pauze tijd is geen nummer.');
      return false;
    }

    if (!btArray.includes(defaultBreaktime)) {
      this.toastr.error('Validator error: Standaard pauze tijd komt niet voor in mogelijke pauze tijden.');
      return false;
    }

    return true;
  }

  /**
   * Gets setting data from the settingCache, parses it to the correct data type, and sets it to the
   * settings in the settingData array.
   *
   * Finally, it returns an object that will be sent back to the api. The api expects this format.
   */
  private getSettingData() {
    this.settingData.forEach((setting) => {
      setting.value = this.settingCache[setting.name];
    });

    // Return object with the property settings and stringify it so that a json string is returned.
    return {settings: this.settingData};
  }

  public readonly SettingService = SettingService;
  public readonly environment = environment;
}
