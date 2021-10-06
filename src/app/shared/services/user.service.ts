import {EventEmitter, Injectable} from '@angular/core';
import { User } from '../models/user.model';
import {HttpClient, HttpParams} from '@angular/common/http';
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

  /**
   * Method will try to update the given formUser.
   * @param formUser User
   */
  public update(formUser: User) {
    // Create payload
    const newUserPayload = {
      id: formUser.id,
      name: formUser.name,
      middleName: formUser.middleName,
      lastName: formUser.lastName,
      username: formUser.username,
      email: formUser.email,
      password: formUser.password,
      admin: formUser.admin,
      active: formUser.active
    };

    return this.http.post<any>('/user/update', newUserPayload)
      .toPromise()
      .then( res => {
        if (res.statusCode === 200) {
          this.getUsers();
          this.toastr.success('Gebruiker: ' + newUserPayload.username + ' is succesvol geüpdatet.', 'Gebruiker geüpdatet');
        } else {
          this.toastr.error('De gebruiker kon niet worden geüpdatet.' +
            'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: Gebruiker kon niet worden geüpdatet');
        }
      }).catch(err => {
        // Handled by HTTP interceptor: ErrorInterceptor
      });
  }

  /**
   * Tries to submit user data for a new user. Only call this method when dealing with a new user.
   * Will send a post request to the api with the formUser data as payload.
   * @param formUser User
   */
  public submit(formUser: User) {
    // create payload
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
        if (res.statusCode === 200) {
          this.getUsers();
          this.toastr.success('Gebruiker: ' + newUserPayload.username + ' is succesvol aangemaakt.', 'Gebruiker aangemaakt');
        } else {
          this.toastr.error('De gebruiker kon niet worden aangemaakt.' +
            'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: Gebruiker kon niet worden aangemaakt');
        }
      }).catch(err => {
        // Handled by HTTP interceptor: ErrorInterceptor
      });
  }

  public deleteUser(formUser: User) {
    // create payload
    const deleteUserPayload = {
      id: formUser.id,
      name: formUser.name,
      middleName: formUser.middleName,
      lastName: formUser.lastName,
      username: formUser.username,
      email: formUser.email,
      password: formUser.password,
      admin: formUser.admin,
      active: formUser.active
    };

    return this.http.post<any>('/user/delete', deleteUserPayload)
      .toPromise()
      .then( res => {
        if (res.statusCode === 200) {
          this.getUsers();
          this.toastr.success('Gebruiker: ' + deleteUserPayload.username + ' en al zijn data, is succesvol verwijderd.',
            'Gebruiker verwijderd.');
        } else {
          this.toastr.error('De gebruiker kon niet worden verwijderd.' +
            'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: Gebruiker kon niet worden verwijderd');
        }
      }).catch(err => {
        // Handled by HTTP interceptor: ErrorInterceptor
      });
  }

  /**
   * Used by the buttons on the form to determine if the button is shown or not.
   * TODO: QOL improvement change html to show 'grayed out' buttons instead of removing them.
   * @param user userId
   */
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
