import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * StateService holds functionality to switch between states. A state determines which
 * component is active in the admin or user component.
 */
@Injectable()
export class StateService {
  currentState = new BehaviorSubject(null);
  private previousState: string;
  private userRole: string;
  private adminStates = ['OVERVIEW', 'MANAGE_USERS'];
  private userStates = ['HOUR_FORM'];

  private initState(): void {
    if (this.userRole === 'ADMIN') {
      this.currentState.next('OVERVIEW');
    }
    if (this.userRole === 'EMPLOYEE') {
      this.currentState.next('HOUR_FORM');
    }
  }

  // on component init, set userRole
  public setUserRole(userRole: string): void {
    // TODO: Can only be set once.
    this.userRole = userRole;
    this.initState();
  }

  // public getState(): string {
  //   return this.currentState.getValue();
  // }

  public updateState(state: string): void {
    if (this.userRole === 'ADMIN') {
      if (this.adminStates.includes(state)) {
        this.previousState = this.currentState.getValue();
        this.currentState.next(state);
      }
    }

    if (this.userRole === 'EMPLOYEE') {
      if (this.userStates.includes(state)) {
        this.previousState = this.currentState.getValue();
        this.currentState.next(state);
      }
    }
  }
}
