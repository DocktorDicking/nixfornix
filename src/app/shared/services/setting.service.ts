import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingModel} from '../models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  // Lib of current settings, just to make referencing easier.
  public static LOGO = 'logo';
  public static DEFAULT_BREAKTIME = 'default-breaktime';
  public static BREAKTIMES = 'breaktimes';
  public static DEFAULT_LOCATION = 'default-location';
  public static ADMIN_REGISTER_TIME = 'admin-register-time';
  public static ADMIN_MANAGE_USERS = 'admin-manage-users';
  public static MAX_USERS = 'max-users';

  constructor(private http: HttpClient) {}

  private settings: SettingModel[] = null;

  public getSetting(name: string): SettingModel {
    this.settings.forEach((setting) => {
      if (setting.name === name) {
        return setting;
      }
    });
    return null;
  }

  public getSettings() {
    return this.settings;
  }

  load(): Promise<any> {
    return new Promise<any>(resolve => {
      this.http.get('/setting/get').subscribe(
        response => {
          // @ts-ignore response is an array with Settings.
          this.settings = response;
          resolve(this.settings);
        });
    });
  }
}
