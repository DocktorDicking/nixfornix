import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { DatabaseService } from './database.service';

@Injectable()
export class UserService {

  // private dbs = DatabaseService <- putting this in the constructor broke the project. Has something to do with the order of importing stuff.
  constructor() {
  }

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
      user.name = this.firstnames[i];
      user.lastName = this.lastnames[Math.floor(Math.random() * Math.floor(this.lastnames.length - 1))];
      user.admin = (user.name === 'Nico' || user.name === 'Nick');
      user.email = (user.name + user.lastName);
      user.password = 'welkom' + id;
      this.users.push(user);
      id++;
    }
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

  // TODO: Rewrite this method when we have a working dbs.
  public submit(formUser: User) {
    // TODO Check if user exists
    const user = this.getUser(formUser.id);
    if (user) {
      user.name = formUser.name;
      user.middleName = formUser.middleName;
      user.lastName = formUser.lastName;
      user.password = formUser.password;
      user.email = formUser.email;
      user.admin = formUser.admin;
    } else {
      formUser.id = (this.users.length + 1);
      const data = JSON.stringify(formUser);
      this.users.push(formUser);
    }
  }

  public deleteUser(id: number): boolean {
    for (const user of this.users) {
      if (user.id === id) {
        this.users.splice(this.users.indexOf(user), 1);
        return true;
      }
    }
    return false;
  }

  public isEmpty(user: User) {
    for (const key of Object.keys(user)) {
      if (key !== 'id') {
        if (!(user[key] === null || user[key] === '' || user[key] === undefined)) {
          return false;
        }
      }
    }
    return true;
  }
}
