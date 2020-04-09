import { Component, OnInit } from '@angular/core';
import {User} from '../../shared/models/user.model';
import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  public users: User[];
  public formUser: User = new User(0);
  public message: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.users = this.userService.getUsers();
  }

  public onSave() {
    // If user is in user array update. Otherwise create
  }

  public onUserData(id: number) {
    for (const user of this.users) {
      if (user.id === id) {
        this.formUser = user;
        break;
      }
    }
  }

  public resetFormUser() {
    this.formUser = new User(0);
  }
}
