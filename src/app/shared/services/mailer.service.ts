import {Injectable} from '@angular/core';
import { User } from '../models/user.model';
import {HttpClient} from '@angular/common/http';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

/**
 * TODO: Docu
 */
@Injectable()
export class MailerService {

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) {
  }

  /**
   * TODO: Docu
   * @param user User
   */
  public sendCredentials(user: User) {
    if (!this.authService.currentUserValue.admin) {
      this.authService.logout();
      this.toastr.warning('Bruh', 'Bruh');
    }

    const payload = {
      id: user.id,
      name: user.name,
      middleName: user.middleName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      password: user.password
    };

    this.http.post<any>('/mail/credentials', payload).toPromise();
    this.toastr.info('De inloggegevens zijn volgens het systeem verzonden.', 'Inloggegevens verzonden');
  }
}
