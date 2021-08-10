import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/services/state.service';
import { AuthService } from '../shared/services/auth.service';
import {User} from '../shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private state: string;

  constructor(private stateService: StateService, private authService: AuthService) { }

  ngOnInit() {
    this.stateService.setAdmin(this.authService.currentUserValue.admin);
    this.stateService.currentState.subscribe(currentState => this.state = currentState);
  }
}
