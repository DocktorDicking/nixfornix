/**
 * Data model for location data.
 * Called this class WorkLocation because we had conflicts using Location.
 * And you know.. WorkLocation is the first thing that came to mind.
 *
 * AKA project.
 */
export class WorkLocation {
  id: number;
  name: string;
  description: string;
  rate: any;

  constructor(id?: number, location?: WorkLocation) {
    if (id) {
      this.id = id;
    }
    if (location) {
      this.id = location.id;
      this.name = location.name;
      this.description = location.description ? location.description : '';
      this.rate = location.rate ? location.rate : 0;
    }
  }
}
