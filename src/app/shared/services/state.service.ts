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
  private isAdmin: boolean;
  private adminStates = ['OVERVIEW', 'MANAGE_USERS'];
  private userStates = ['HOUR_FORM', 'HOUR_OVERVIEW'];

  private initState(): void {
    if (this.isAdmin) {
      this.currentState.next('OVERVIEW');
    }
    if (!this.isAdmin) {
      this.currentState.next('HOUR_FORM');
    }
  }

  // on component init, set userRole
  public setAdmin(value: boolean): void { // TODO: This is for testing, base on retrieved user whenever we have db.
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
