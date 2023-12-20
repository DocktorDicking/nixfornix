import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import {SettingService} from '../services/setting.service';

/**
 * This class is used to resolve the settingData before the route is loaded.
 * This is needed because the settingData is used in multiple components.
 * This way the settingData is loaded only once.
 */
@Injectable()
export class SettingDataResolver implements Resolve<any> {

  constructor(private settingService: SettingService) {}

  // This method is called by Angular during routing.
  async resolve() {
    const settingData = await this.settingService.load().toPromise();
    return settingData;
  }
}
