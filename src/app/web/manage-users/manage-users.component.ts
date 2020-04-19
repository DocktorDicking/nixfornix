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

  constructor(private userService: UserService) { }

  ngOnInit() {
    if (this.userService.users.length === 0) {
      this.userService.generateUsers();
    }
  }

  public onSave() {
    this.userService.submit(this.formUser);
  }

  public onUserData(id: number) {
    // TODO add some way to throw an error when a user id does not exist
    const user = this.userService.getUser(id);
    if (user) {
      this.formUser = new User(null, user);
    }
  }

  public onDelete(id: number) {
    if (this.userService.deleteUser(id)) {
      this.resetFormUser();
    }
  }

  public resetFormUser() {
    this.formUser = new User(0);
  }


}
