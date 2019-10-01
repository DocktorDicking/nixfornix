/**
 * Datamodel for user data.
 */
export class User {
  private id: number;
  private _firstName: string;
  private _prepostition: string;
  private _lastName: string;
  private _username: string;

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get FullName() {
    return this._firstName + ' ' + this._prepostition + ' ' + this._lastName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  set prepostition(value: string) {
    this._prepostition = value;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  set username(value: string) {
    this._username = value;
  }
}
