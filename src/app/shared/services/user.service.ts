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
        } else {
          this.toastr.warning('Er zijn geen gebruikers gevonden in de database.', 'Geen gebruikers gevonden');
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
    // add the user id to this time row.
    const newUserPayload = {
      name: formUser.name,
      middleName: formUser.middleName,
      lastName: formUser.lastName,
      username: formUser.username,
      email: formUser.email,
      password: formUser.password,
      admin: formUser.admin,
      active: formUser.active
    };

    return this.http.post<any>('/user/create', newUserPayload)
      .toPromise()
      .then( res => {
        if (res) {
          this.getUsers();
          this.toastr.success('Gebruiker: ' + newUserPayload.username + ' is succesvol aangemaakt.', 'Gebruiker aangemaakt');
        } else {
          this.toastr.error('De gebruiker kon niet worden aangemaakt.' +
            'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: Gebruiker kon niet worden aangemaakt');
        }
      }).catch(err => {
        this.toastr.error('De gebruiker kon niet worden aangemaakt.' +
          'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: Gebruiker kon niet worden aangemaakt');
        // Handled by HTTP interceptor: ErrorInterceptor
      });
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
