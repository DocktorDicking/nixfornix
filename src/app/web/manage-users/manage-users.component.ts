import { Component, OnInit } from '@angular/core';
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  user = new User(null);

  constructor() { }

  ngOnInit() {
  }

  public onSave() {

  }

}
