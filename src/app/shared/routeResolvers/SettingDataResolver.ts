import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import {SettingService} from '../services/setting.service';

@Injectable()
export class SettingDataResolver implements Resolve<any> {

  constructor(private settingService: SettingService) {}

  // This method is called by Angular during routing.
  async resolve() {
    const settingData = await this.settingService.load().toPromise();
    return settingData;
  }
}
