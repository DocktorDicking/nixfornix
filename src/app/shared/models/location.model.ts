/**
 * Data model for location data.
 * Called this class WorkLocation because we had conflicts using Location.
 * And you know.. WorkLocation is the first thing that came to mind.
 */
export class WorkLocation {
  id: number;
  name: string;
  description: string;

  constructor(id?: number, location?: WorkLocation) {
    if (id) {
      this.id = id;
    }
    if (location) {
      this.id = location.id;
      this.name = location.name;
      this.description = location.description ? location.description : '';
    }
  }
}
