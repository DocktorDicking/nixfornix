import {Component, OnInit} from '@angular/core';
import {StateService} from '../../../shared/services/state.service';
import {AuthService} from '../../../shared/services/auth.service';
import $ from 'jquery';
import {ActivatedRoute} from '@angular/router';
import {SettingService} from '../../../shared/services/setting.service';
import {SettingModel} from '../../../shared/models/setting.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  // Needed for static variable references
  public readonly SettingService = SettingService;
  public readonly StateService = StateService;

  public settingData: SettingModel[];
  public adminCanRegisterTime = false;
  public adminCanManageUsers = false;

  constructor(public stateService: StateService, private authService: AuthService,
              private route: ActivatedRoute) {

    // Reads the settingData from the RouteResolver, see SettingDataResolver.
    this.route.data.subscribe(() => {
      this.settingData = this.route.snapshot.data.settingData;
    });
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
    // Initializing setting vars. Cannot be done in template, result to null.
    this.settingData.forEach((setting) => {
      switch (setting.name) {
        case SettingService.ADMIN_MANAGE_USERS:
          // Cast from String to boolean using JSON
          this.adminCanManageUsers = JSON.parse(setting.value);
          break;
        case SettingService.ADMIN_REGISTER_TIME:
          // Cast from String to boolean using JSON
          this.adminCanRegisterTime = JSON.parse(setting.value);
          break;
      }
    });

    $('.sidebar-toggle').on('click', function() {
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

  isActiveState(state: string) {
    return (this.stateService.getCurrentStateString() === state);
  }
}
