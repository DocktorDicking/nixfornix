import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * StateService holds functionality to switch between states. A state determines which
 * component is active in the admin or user component.
 *
 * StateService is currently used to display the correct menu buttons and to keep track on which page (state) the user is.
 */
@Injectable()
export class StateService {
  currentState = new BehaviorSubject(null);
  private previousState: string;
  private isAdmin: boolean;

  // Allowed states to access
  private adminStates = ['OVERVIEW_ALL', 'MANAGE_USERS', 'DASHBOARD', 'ADMIN_LOG', 'MANAGE_LOCATIONS', 'MANAGE_SETTINGS'];
  private userStates = ['HOUR_FORM', 'HOUR_OVERVIEW', 'USER_PROFILE'];

  // Default page landing, might want to move this to the setting table?
  private initState(): void {
    if (this.isAdmin) {
      this.currentState.next('OVERVIEW_ALL');
    }
    if (!this.isAdmin) {
      this.currentState.next('HOUR_FORM');
    }
  }

  // on component init, set userRole
  public setAdmin(value: boolean): void {
    this.isAdmin = value;
    this.initState();
  }

  public getAdmin(): boolean {
    return this.isAdmin;
  }

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
