/**
 * Data model for user data.
 */
export class User {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  admin: boolean;

  constructor(id?: number, user?: User) {
    if (id) {
      this.id = id;
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

  get fullName() {
    const prepostition = this.middleName ? ' ' + this.middleName + ' ' : ' ';
    return this.firstName + prepostition + this.lastName;
  }
}
