import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  public readonly NEW_USER_ID: number = 0;

  public formUser: User = new User(this.NEW_USER_ID);
  public message: string;
  public hidePw = false;
  public newPassword: string;

  constructor(public userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.userService.getUsers();
    this.newPassword = '';
  }

  /**
   * Will call for update when a user already exists in the userService user list which is fetched
   * from the server.
   *
   * update will send a post to /update, create will send a post to /create
   */
  public onSave() {
    // if exist in userService (thus an existing user, call update)
    if (!this.isNewUser() || this.userService.getUser(this.formUser.id) != null) {
      this.userService.update(this.formUser);
    } else if (this.isNewUser()) {
      this.userService.submit(this.formUser);
    }
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
    this.formUser.password = this.newPassword;
    this.userService.update(this.formUser);
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
}
