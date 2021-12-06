import { Component, OnInit } from '@angular/core';
import { StateService } from '../../../shared/services/state.service';
import { AuthService } from '../../../shared/services/auth.service';
import $ from 'jquery';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(public stateService: StateService, private authService: AuthService) {

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
