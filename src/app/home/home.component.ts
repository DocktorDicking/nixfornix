import { Component, OnInit } from '@angular/core';
import { StateService } from '../shared/services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private state: string;

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.stateService.setAdmin(false);
    this.stateService.currentState.subscribe(currentState => this.state = currentState);
  }
}
