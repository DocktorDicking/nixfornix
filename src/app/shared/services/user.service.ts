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

  /**
   * Returns all users
   * @return User[]
   */
  public getUsers(): User[] {
    const users: User[] = [];
    let id = 1;
    for (let i = 0; i < this.firstnames.length - 1; i++) {
      const user = new User(id);
      user.firstName = this.firstnames[i];
      user.lastName = this.lastnames[Math.floor(Math.random() * Math.floor(this.lastnames.length - 1))];
      user.admin = (user.firstName === 'Nico' || user.firstName === 'Nick');
      user.email = (user.firstName + user.lastName);
      user.password = 'welkom' + id;
      users.push(user);
      id++;
    }
    return users;
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



}
