/**
 * Data model for user data.
 */
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';

export class User {
  id: number;
  name: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  admin: boolean;

  constructor(id?: number, user?: User) {
    if (id) {
      this.id = id;
    }
    if (user) {
      this.id = user.id;
      this.name = user.name;
      this.middleName = user.middleName;
      this.lastName = user.lastName;
      this.username = user.username;
      this.email = user.email;
      this.password = user.password;
      this.admin = user.admin;
    }
  }

  get fullName() {
    if (isNotNullOrUndefined(this.middleName)) {
      const prepostition = this.middleName ? ' ' + this.middleName + ' ' : ' ';
      return this.name + prepostition + this.lastName;
    }
    return this.name + ' ' + this.lastName;
  }
}
