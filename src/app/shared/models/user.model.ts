/**
 * Data model for user data.
 */
export class User {
  private _id: number;
  private _firstName: string;
  private _middleName: string;
  private _lastName: string;
  private _username: string;
  private _role: string;
  private _password: string;

  constructor(id: number) {
    this._id = id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName() {
    const prepostition = this._middleName ? ' ' + this._middleName + ' ' : ' ';
    return this._firstName + prepostition + this._lastName;
  }

  get role() {
    return this._role;
  }

  get password() {
    return this._password;
  }

  get username() {
    return this._username;
  }

  set password(value: string) {
    this._password = value;
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
