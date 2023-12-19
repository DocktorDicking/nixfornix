import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingModel} from '../models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  // Lib of current settings, just to make referencing easier.
  public static DEFAULT_BREAKTIME = 'default-breaktime';
  public static BREAKTIMES = 'breaktimes';
  public static DEFAULT_LOCATION = 'default-location';
  public static ADMIN_REGISTER_TIME = 'admin-register-time';
  public static ADMIN_MANAGE_USERS = 'admin-manage-users';
  public static MAX_USERS = 'max-users';
  public static TABLE_SHOW_COL_EMPLOYEE = 'table-show-col-employee';
  public static TABLE_SHOW_COL_DESCRIPTION = 'table-show-col-description';
  public static TABLE_SHOW_COL_LOCATION = 'table-show-col-location';
  public static TABLE_SHOW_COL_APPROVED = 'table-show-col-approved';
  public static DASH_SHOW_RATE = 'dash-show-rate';
  public static LICENSE_DATE = 'license-date';

  constructor(private http: HttpClient) {}

  load() {
    return this.http.get<any>('/setting/get');
  }

  /**
   * Calls API to update the given settings.
   *
   * @param settingJson
   */
  public onUpdate(settingJson: { settings: SettingModel[] }): Promise<any> {
    return this.http.post<any>('/setting/update', settingJson).toPromise();
  }
}
