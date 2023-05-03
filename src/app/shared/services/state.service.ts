import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {User} from '../models/user.model';

/**
 * StateService holds functionality to switch between states. A state determines which
 * component is active in the admin or user component.
 *
 * StateService is currently used to display the correct menu buttons and to keep track on which page (state) the user is.
 *
 * Possible states:
 * 'OVERVIEW_ALL', 'MANAGE_USERS', 'DASHBOARD', 'ADMIN_LOG', 'MANAGE_LOCATIONS', 'MANAGE_SETTINGS'
 * 'HOUR_FORM', 'HOUR_OVERVIEW', 'USER_PROFILE'
 */
@Injectable()
export class StateService {
  currentState = new BehaviorSubject(null);
  private previousState: string;
  private isAdmin: boolean;

  // Allowed states to access for admin or user.
  private adminStates = ['OVERVIEW_ALL', 'MANAGE_USERS', 'DASHBOARD', 'ADMIN_LOG', 'MANAGE_LOCATIONS', 'MANAGE_SETTINGS'];
  private userStates = ['HOUR_FORM', 'HOUR_OVERVIEW', 'USER_PROFILE'];

  public initialize(currentUser: User) {
    this.setAdmin(currentUser.admin);

    // Init first state of the state service
    if (this.isAdmin) {
      this.currentState.next('OVERVIEW_ALL');
    } else {
      this.currentState.next('HOUR_FORM');
    }
  }

  // on component init, set userRole
  private setAdmin(value: boolean): void {
    this.isAdmin = value;
  }

  public getAdmin(): boolean {
    return this.isAdmin;
  }

  /**
   *
   * @param state
   */
  public updateState(state: string): void {
    if (this.isAdmin) {
      if (this.adminStates.includes(state)) {
        this.previousState = this.currentState.getValue();
        this.currentState.next(state);
      }
    }

    if (!this.isAdmin) {
      if (this.userStates.includes(state)) {
        this.previousState = this.currentState.getValue();
        this.currentState.next(state);
      }
    }
  }
}
