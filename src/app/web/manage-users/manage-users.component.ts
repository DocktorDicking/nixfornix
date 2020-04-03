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

  constructor(private userService: UserService) { }

  ngOnInit() {
    debugger;
    this.users = this.userService.getUsers();
  }

  public onSave() {

  }

}
