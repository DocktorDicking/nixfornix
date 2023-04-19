/**
 * Data model for location data.
 */
export class Location {
  id: number;
  name: string;
  description: string;

  constructor(id?: number, location?: Location) {
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
