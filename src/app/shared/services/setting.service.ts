import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SettingModel} from '../models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private settings: SettingModel[] = null;

  constructor(private http: HttpClient) {}

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
