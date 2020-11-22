import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import {TimeRow} from '../models/timeRow.model';
import {Time} from '@angular/common';

/**
 * File for our own database service. This will replace the fireStore service when we have our own backend.
 *
 * This service will have all CRUD methods needed by this application to send data to the database.
 */
@Injectable()
export class DatabaseService {
  // TODO: GET METHODS NEED TO RETURN OBSERVALBES?

  constructor() {
  }

  // AUTHENTICATION METHODS
  authenticate(user: User): boolean {
    const url = '/authenticate';
    return null;
  }

  whoami(token: string): User {
    const url = '/whoami';
    return null;
  }

  // USER METHODS
  createUser(user: User): boolean {
    const url = '/user/create';
    return null;
  }

  updateUser(user: User): boolean {
    const url = '/user/update';
    return null;
  }

  deleteUser(userId: number) {
    const url = '/user/delete';
  }

  getUsers(): Array<User> {
    const url = '/user/list';
    return null;
  }

  getUser(userId: number): User {
    return null;
  }

  // TIME METHODS
  createTime(timeRow: TimeRow): boolean {
    return null;
  }

  updateTIme(timeRow: TimeRow): boolean {
    return null;
  }

  getAllTimes(): Array<TimeRow> {
    return null;
  }

  getTimes(userId: number): Array<TimeRow> {
    return null;
  }

  // TODO: Continue




}
