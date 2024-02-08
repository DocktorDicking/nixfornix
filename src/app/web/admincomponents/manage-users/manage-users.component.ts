import {Component, OnInit} from '@angular/core';
import {User} from '../../../shared/models/user.model';
import {UserService} from '../../../shared/services/user.service';
import {AuthService} from '../../../shared/services/auth.service';
import {MailerService} from '../../../shared/services/mailer.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  // TODO Add validation on e-mail before showing the option to send e-mails
  // TODO Add validation for all other fields.

  public readonly NEW_USER_ID: number = 0;
  public showInactive = false;

  public formUser: User = new User(this.NEW_USER_ID);
  public message: string;
  public hidePw = true;
  public newPassword: string;
  public sendmail = false;

  constructor(public userService: UserService, private authService: AuthService, private mailerService: MailerService,
              private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.userService.getUsers(this.showInactive);
    this.newPassword = '';
    this.spinner.hide();
  }

  /**
   * Will call for update when a user already exists in the userService user list which is fetched
   * from the server.
   *
   * update will send a post to /update, create will send a post to /create
   */
  public onSave() {
    // if exist in userService (thus an existing user, call update)
    // TODO on success check if email needs to be send. Create a mailerService for sending http requests to the api /mail
    if (!this.isNewUser() || this.userService.getUser(this.formUser.id) != null) {
      this.userService.update(this.formUser);
    } else if (this.isNewUser()) {
      this.userService.submit(this.formUser).finally(() => {
        if (this.sendmail) {
          if (this.formUser.email == null || !this.isValidEmail(this.formUser.email)) {
            this.toastr.warning('Controleer het e-mail adres van de gebruiker. Het lijkt erop dat deze niet valide is. ' +
              'De gebruiker is wel aangemaakt.', 'E-mail kan niet verzonden worden.');
          } else {
            this.sendCredMail(this.formUser);
          }
        }
      });
    }
  }

  /**
   * Used by the checkbox on top of the table to show/hide inactive users.
   * This does not do a http call but loads the data from the userCache.
   */
  public showInactiveChange() {
    this.userService.showInactive = this.showInactive;
    this.userService.refreshDataFromCache();
  }

  /**
   * Set's the selected user as the formUser.
   * formUser is bind to the add/update form.
   * @param id userId
   */
  public onUserData(id: number) {
    const user = this.userService.getUser(id);
    if (user) {
      this.formUser = new User(null, user);
    }
  }

  public onDelete() {
    this.userService.deleteUser(this.formUser);
    this.resetFormUser();
  }

  public toggleShowPw() {
    this.hidePw = !this.hidePw;
  }

  public changePassword() {
    // Update password and send api req
    this.formUser.password = this.newPassword;
    this.userService.update(this.formUser);

    // Check if sendmail is checked and try to send cred mail
    if (this.sendmail) {
      if (this.formUser.email == null || !this.isValidEmail(this.formUser.email)) {
        this.toastr.warning('Controleer het e-mail adres van de gebruiker. Het lijkt erop dat deze niet valide is.'
          , 'E-mail kan niet verzonden worden.');
      } else {
        this.sendCredMail(this.formUser);
      }
    }

    this.resetFormUser();
    this.newPassword = '';
  }

  /**
   * If the param forFormUser is set to true:
   *  Set's a random password as the formUsers password.
   * If the param forFormUser equals to (default) false:
   *  Set's a random password on te newPassword variable.
   * @param forFormUser boolean
   */
  public setGeneratedPassword(forFormUser = false) {
    if (!forFormUser) {
      this.newPassword = this.authService.getGeneratedPassword();
    } else {
      this.formUser.password = this.authService.getGeneratedPassword();
    }
  }

  /**
   * Resets the formUser object as a new user object.
   * This is used to clear the user management interface from a selected user.
   */
  public resetFormUser() {
    this.formUser = new User(this.NEW_USER_ID);
  }

  /**
   * Checks if the formUser object is considered a new user. The formUser object haves the id 0 when it is considered new or is undefined.
   */
  public isNewUser(): boolean {
    return (this.formUser.id === this.NEW_USER_ID) || (this.formUser.id === undefined);
  }

  private isValidEmail(email: string): boolean {
    // tslint:disable-next-line:max-line-length
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexp.test(email);
  }

  /**
   * TODO: Docu
   * @param user User
   */
  private sendCredMail(user: User) {
    this.mailerService.sendCredentials(user);
  }
}
