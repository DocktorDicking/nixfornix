/**
 * Data model for location data.
 * Called this class WorkLocation because we had conflicts using Location.
 * And you know.. WorkLocation is the first thing that came to mind.
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
