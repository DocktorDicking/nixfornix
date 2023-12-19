/**
 * Data model for setting data.
 */
export class SettingModel {
  id: number;
  name: string;
  value: any;

  constructor(id?: number, setting?: SettingModel) {
    if (id) {
      this.id = id;
    }
    if (setting) {
      this.id = setting.id;
      this.name = setting.name;
      this.value = setting.value;
    }
  }
}
