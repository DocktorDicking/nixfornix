import { Component, OnInit } from '@angular/core';
import {User} from '../../shared/models/user.model';
import { StateService } from '../../shared/services/state.service';
import {AuthService} from '../../shared/services/auth.service';
import $ from 'jquery';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private stateService: StateService, private authService: AuthService) {
    this.generateUsers(10);
  }
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

  setState(state: string) {
    this.stateService.updateState(state);
  }

  logout() {
    this.authService.logout();
  }

  getSessionFullName(): string {
    return sessionStorage.getItem('auth_fullName');
  }

  ngOnInit(): void {
    $('.sidebar-toggle').on('click', function () {
      $(this).toggleClass('active');

      $('#sidebar').toggleClass('shrinked');
      $('.page-content').toggleClass('active');
      $(document).trigger('sidebarChanged');

      if ($('.sidebar-toggle').hasClass('active')) {
        $('.navbar-brand .brand-sm').addClass('visible');
        $('.navbar-brand .brand-big').removeClass('visible');
        $(this).find('i').attr('class', 'fa fa-long-arrow-right');
      } else {
        $('.navbar-brand .brand-sm').removeClass('visible');
        $('.navbar-brand .brand-big').addClass('visible');
        $(this).find('i').attr('class', 'fa fa-long-arrow-left');
      }
    });
  }
}
