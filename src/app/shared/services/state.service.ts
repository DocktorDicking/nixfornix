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
  // Admin states
  public static OVERVIEW_ALL = 'OVERVIEW_ALL';
  public static DASHBOARD = 'DASHBOARD';
  public static ADMIN_LOG = 'ADMIN_LOG';
  public static MANAGE_USERS = 'MANAGE_USERS';
  public static MANAGE_LOCATIONS = 'MANAGE_LOCATIONS';
  public static MANAGE_SETTINGS = 'MANAGE_SETTINGS';

  // User states
  public static HOUR_FORM = 'HOUR_FORM';
  public static HOUR_OVERVIEW = 'HOUR_OVERVIEW';
  public static USER_PROFILE = 'USER_PROFILE';

  // Default states
  private adminStartState = StateService.OVERVIEW_ALL;
  private userStartState = StateService.HOUR_FORM;

  private settingData;
  currentState = new BehaviorSubject(null);
  private previousState: string;
  private isAdmin: boolean;

  // All states an admin needs access to
  private adminStates = [StateService.OVERVIEW_ALL, StateService.DASHBOARD, StateService.ADMIN_LOG,
    StateService.MANAGE_LOCATIONS, StateService.MANAGE_SETTINGS];

  // All states a user needs access to
  private userStates = [StateService.HOUR_FORM, StateService.HOUR_OVERVIEW, StateService.USER_PROFILE];

  constructor() {}

  public initialize(currentUser: User, adminCanRegister = false, adminCanManageUsers = false) {
    this.setAdmin(currentUser.admin);

    // Check settings for extra states for admin
    if (adminCanRegister) {
      this.adminStates.push(StateService.HOUR_FORM);
      this.adminStartState = StateService.HOUR_FORM;
    }
    if (adminCanManageUsers) {
      this.adminStates.push(StateService.MANAGE_USERS);
    }

    // Init first state of the state service
    if (this.isAdmin) {
      this.currentState.next(this.adminStartState);
    } else {
      this.currentState.next(this.userStartState);
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

  public getCurrentStateString(): string {
    return this.currentState.getValue();
  }
}
