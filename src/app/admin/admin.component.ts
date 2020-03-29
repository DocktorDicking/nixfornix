import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private state: string;
  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.stateService.setUserRole('ADMIN');
    this.stateService.currentState.subscribe(currentState => this.state = currentState);
  }
}
