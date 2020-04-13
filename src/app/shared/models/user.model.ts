/**
 * Data model for user data.
 */
export class User {
  private _id: number;
  private _firstName: string;
  private _middleName: string;
  private _lastName: string;
  private _email: string;
  private _password: string;
  private _admin: boolean;

  constructor(id?: number, user?: User) {
    if (id) {
      this._id = id;
    }
    if (user) {
      this.id = user.id;
      this.firstName = user.firstName;
      this.middleName = user.middleName;
      this.lastName = user.lastName;
      this.email = user.email;
      this.password = user.password;
      this.admin = user.admin;
    }
  }

  public hasCredentials(): boolean {
    if (this.email && this.password) {
      return true;
    }
    return false;
  }

  get id(): number {
    return this._id;
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

  get admin() {
    return this._admin;
  }

  get password(): string {
    return this._password;
  }

  get email(): string {
    return this._email;
  }

  set id(value: number) {
    this._id = value;
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

  set email(value: string) {
    this._email = value;
  }

  set admin(value: boolean) {
    this._admin = value;
  }
}
