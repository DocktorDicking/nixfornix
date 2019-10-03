import { Component, OnInit } from '@angular/core';
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  firstnames: string[] = [
    'Jim',
    'Anouk',
    'Vic',
    'Nico',
    'Nick',
    'Jolanda',
    'Cees',
    'Pip',
    'Ozzy'
  ];

  lastnames: string[] = [
    'Wieringen',
    'Kroon',
    'Goldenberg',
    'Heerikhuizen',
    'Steenvoorden',
    'Tolen'
  ];

  users: Array<User> = [];

  generateUsers(numberOfUsers: number) {
    function randomNumber(max: number) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    for (let i = 0; i < numberOfUsers; i++) {
      const user = new User(i);
      user.firstName = this.firstnames[randomNumber(this.firstnames.length - 1)];
      user.lastName = this.lastnames[randomNumber(this.lastnames.length - 1)];
      this.users.push(user);
    }
  }

  constructor() {
    this.generateUsers(10);
  }

  ngOnInit() {
  }

}
