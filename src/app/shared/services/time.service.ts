import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { TimeRow } from '../models/timeRow.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TimeService {
  recentTimesChanged = new EventEmitter<TimeRow[]>();
  allTimesChanged = new EventEmitter<TimeRow[]>();

  private recentTimes: TimeRow[] = [];
  private allTimes: TimeRow[] = [];

  private DEFAULTBREAKTIME = 30; // TODO: Move to settings file or something alike.
  private DEFAULTLOCATION = 'Luca Catering'; // TODO: Change to numeric value

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) {
  }

  /**
   * Registered a time row.
   */
  onRegisterTime(timeRow: TimeRow) {
    // add the user id to this time row.
    const time = {
      date: timeRow.date,
      start: timeRow.start,
      stop: timeRow.stop,
      breaktime: timeRow.breaktime,
      location: timeRow.location,
      description: timeRow.description,
      hour: timeRow.hour,
      user: {
        id: this.authService.currentUserValue.id
      }
    };

    return this.http.post<any>('/time/create', time)
      .toPromise()
      .then( res => {
        if (res) {
          this.loadRecentTimes();
          this.toastr.success(time.hour + ' uren geregistreerd.', 'Jou uren zijn opgeslagen');
        } else {
          this.toastr.error('Er is iets fout gegaan tijdens het opslaan van jou uren. ' +
            'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: uren konden niet worden opgeslagen');
        }
      }).catch(err => {
        this.toastr.error('Er is iets fout gegaan tijdens het opslaan van jou uren. ' +
          'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: uren konden niet worden opgeslagen');
        // Handled by HTTP interceptor: ErrorInterceptor
      });
  }

  /**
   * Returns a new time object.
   */
  newTimeObj(): TimeRow {
    const time = new TimeRow();
    time.breaktime = this.DEFAULTBREAKTIME;
    time.location = this.DEFAULTLOCATION;
    return time;
  }

  calculateWorkedHours(time: TimeRow) {
    const splitStart = time.start.split(':', 2);
    const splitStop = time.stop.split(':', 2);

    // Create dateobjects
    const start = new Date(time.date);
    const end = new Date(time.date);
    start.setHours(parseInt(splitStart[0]) , parseInt(splitStart[1]));
    end.setHours(parseInt(splitStop[0]), parseInt(splitStop[1]));

    // If endtime is past midnight add a day to end
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    // @ts-ignore
    const diff = (end - start); // milliseconds
    let minutes = Math.floor(diff / 1000 / 60);
    minutes = minutes - time.breaktime;
    time.hour = Math.floor((minutes / 60) * 100) / 100;
  }

  /**
   * Loads recent times registered by the user. Api set's the max values of rows on 10.
   */
  loadRecentTimes() {
    this.http.get<TimeRow[]>('/time/get/recent?user_id=' + this.authService.currentUserValue.id)
      .subscribe(data => {
        if (data.length > 0) {
          this.recentTimes = data;
          this.recentTimesChanged.emit(this.recentTimes);
        }
      });
  }

  /**
   * Loads recent times registered by the user. Api set's the max values of rows on 10.
   */
  loadAllTimes() {
    this.http.get<TimeRow[]>('/time/list?user_id=' + this.authService.currentUserValue.id)
      .subscribe(data => {
        if (data.length > 0) {
          this.allTimes = data;
          this.allTimesChanged.emit(this.allTimes);
        }
      });
  }

  /**
   * Will return all times of a user.
   */
  getAllTimes(user: User): Array<TimeRow> { // TODO: Make this fetch data from a database
    return this.recentTimes.slice(); // Slice returns a copy, so the source data cannot be changed.
  }

  getOneTime(id: number): TimeRow {
    return null;
  }

  updateTime(id: number): boolean {return null; }

  deleteTime(id: number): boolean {return null; }


}
