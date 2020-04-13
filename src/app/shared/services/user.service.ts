import {Injectable} from '@angular/core';
import {User} from '../models/user.model';

@Injectable()
export class UserService {
  private firstnames: string[] = [
    'Jim',
    'Anouk',
    'Vic',
    'Nico',
    'Nick',
    'Jolanda',
    'Cees',
    'Pip',
    'Ozzy'
  ];

  private lastnames: string[] = [
    'Wieringen',
    'Kroon',
    'Goldenberg',
    'Heerikhuizen',
    'Steenvoorden',
    'Tolen'
  ];

  public users: User[] = [];

  /**
   * Returns all users
   * @return User[]
   */
  public generateUsers() {
    let id = 1;
    for (let i = 0; i < this.firstnames.length - 1; i++) {
      const user = new User(id);
      user.firstName = this.firstnames[i];
      user.lastName = this.lastnames[Math.floor(Math.random() * Math.floor(this.lastnames.length - 1))];
      user.admin = (user.firstName === 'Nico' || user.firstName === 'Nick');
      user.email = (user.firstName + user.lastName);
      user.password = 'welkom' + id;
      this.users.push(user);
      id++;
    }
  }

  /**
   * Creates a new user
   * @return boolean
   */
  public createUser(user: User): boolean {
    return false;
  }

  /**
   * Updates an existing user
   * @return boolean
   */
  public updateUser(user: User): boolean {
    return false;
  }

  /**
   * Validates user object on errors and returns a boolean and a message.
   * @return boolean
   */
  public validateUser(user: User, message: string): boolean {
    return false;
  }

  public getUser(id: number): User {
    for (const user of this.users) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  public submit(formUser: User) {
    // TODO Check if user exists
    const user = this.getUser(formUser.id);
    if (user) {
      user.firstName = formUser.firstName;
      user.middleName = formUser.middleName;
      user.lastName = formUser.lastName;
      user.password = formUser.password;
      user.email = formUser.email;
      user.admin = formUser.admin;
    } else {
      formUser.id = (this.users.length + 1);
      this.users.push(formUser);
    }
  }
}
