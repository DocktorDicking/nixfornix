import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private state: string;

  constructor() { }

  ngOnInit() {
  }

  setState(state: string): void {

  }
}
