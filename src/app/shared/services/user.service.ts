import {EventEmitter, Injectable} from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class UserService {
  usersChanged = new EventEmitter<User[]>();
  public users: User[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) {
  }

  /**
   * Returns all users
   * @return User[]
   */
  public getUsers() {
    this.http.get<User[]>('/user/list')
      .subscribe(data => {
        if (data.length > 0) {
          this.users = data;
          this.usersChanged.emit(this.users);
        }
      });
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
