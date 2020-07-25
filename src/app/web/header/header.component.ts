import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  getCurrentDate() {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = date.getFullYear();

    const dateString = dd + '/' + mm + '/' + yyyy;
    return dateString;
  }

  constructor(private authService: AuthService) { }

  ngOnInit() {

  }

  logout() {
    this.authService.logout();
  }

}
