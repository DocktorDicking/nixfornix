/**
 * Datamodel for user data.
 */
export class User {
  private _id: number;
  private _firstName: string;
  private _middleName: string;
  private _lastName: string;
  private _username: string;

  constructor(id: number) {
    this._id = id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get FullName() {
    const prepostition = this._middleName ? ' ' + this._middleName + ' ' : ' ';
    return this._firstName + prepostition + this._lastName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  set middleName(value: string) {
    this._middleName = value;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  set username(value: string) {
    this._username = value;
  }
}
