import { Component, OnInit } from '@angular/core';
import {User} from '../../shared/models/user.model';
import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  public formUser: User = new User(0);
  public message: string;

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers();
  }

  /**
   * Will call for update when a user already exists in the userService user list which is fetched
   * from the server.
   *
   * update will send a post to /update, create will send a post to /create
   */
  public onSave() {
    // if exist in userService (thus an excisting user, call update)
    if (this.formUser.id !== 0 && this.formUser.id !== undefined
      || this.userService.getUser(this.formUser.id) != null) {
      this.userService.update(this.formUser);
    } else {
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

  public resetFormUser() {
    this.formUser = new User(0);
  }
}
