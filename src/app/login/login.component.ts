import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;
  user = new User(0);

  onSubmit() {
    this.submitted = true;

    // Get form data
    // Create http request
    // Send to server
    // If user != null redirect and load user data.

    this.router.navigate(['./home']);
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }
}
