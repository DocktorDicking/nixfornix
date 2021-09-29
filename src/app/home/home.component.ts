import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/services/state.service';
import { AuthService } from '../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public state: string;

  constructor(private stateService: StateService, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    this.stateService.setAdmin(this.authService.currentUserValue.admin);
    this.stateService.currentState.subscribe(currentState => this.state = currentState);

    // Welcome message
    const currentUser: User = this.authService.currentUserValue;
    const middleName = currentUser.middleName ? currentUser.middleName : '';
    const fullName = currentUser.name + ' ' + middleName + currentUser.lastName;
    this.toastr.info('Welkom terug ' + fullName , 'Login succesvol');
  }
}
