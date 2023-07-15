import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {TimeRow} from '../models/timeRow.model';
import {AuthService} from './auth.service';
import {ToastrService} from 'ngx-toastr';
import {Observable, Subscription} from 'rxjs';
import {SettingModel} from '../models/setting.model';
import {SettingService} from './setting.service';

@Injectable()
export class TimeService {
  public recentTimesChanged = new EventEmitter<TimeRow[]>();
  private recentTimes: TimeRow[] = [];

  private settingData = [];
  private DEFAULTBREAKTIME: number;
  private DEFAULTLOCATION: string;
  public BREAKTIMES: number[];

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) {}

  public initialize(settingData: SettingModel[]) {
    /*
    Because there are multiple components calling this method we want to make sure that this is
    only run once. Components calling this method at the moment of writing this are:
    - hour-table-all.component-admin.ts
    - hour-form.component.ts
     */
    if (this.settingData.length < 1) {
      this.settingData = settingData;

      // Initializing setting vars.
      this.settingData.forEach((setting) => {
        switch (setting.name) {
          case SettingService.DEFAULT_BREAKTIME:
            // Cast from String to number
            this.DEFAULTBREAKTIME = JSON.parse(setting.value);
            break;
          case SettingService.DEFAULT_LOCATION:
            this.DEFAULTLOCATION = setting.value;
            break;
          case SettingService.BREAKTIMES:
            // Cast from String to boolean using JSON
            this.BREAKTIMES = JSON.parse(setting.value);
            break;
        }
      });
    }
  }

  /**
   * Registered a time row.
   */
  public onRegisterTime(timeRow: TimeRow): Promise<any> {
    // add the user id to this time row.
    timeRow.user = this.authService.currentUserValue;
    this.calculateWorkedHours(timeRow);
    const timePayload = this.getPayload(timeRow);
    return this.http.post<any>('/time/create', timePayload).toPromise();
  }

  /**
   * Updates a TimeRow.
   */
  public onUpdateTime(timeRow: TimeRow): Promise<any> {
    this.calculateWorkedHours(timeRow);
    const timePayload = this.getPayload(timeRow);
    return this.http.post<any>('/time/update', timePayload).toPromise();
  }

  /**
   * Method for onClick listener to delete a registration.
   * @param timeRow TimeRow
   */
  public onDeleteTime(timeRow: TimeRow): Promise<any> {
    const timePayload = this.getPayload(timeRow);
    return this.http.post<any>('/time/delete', timePayload).toPromise();
  }

  /**
   * Returns the given TimeRow object as a javascript object so that we can inject it into the http request.
   * @param timeRow TimeRow
   */
  private getPayload(timeRow: TimeRow) {
    return {
      id: timeRow.id,
      date: timeRow.date,
      start: timeRow.start,
      stop: timeRow.stop,
      breaktime: timeRow.breaktime,
      location: timeRow.location,
      description: timeRow.description,
      hour: timeRow.hour,
      createdAt: timeRow.createdAt,
      approved: timeRow.approved,
      user: {
        id: timeRow.user.id
      }
    };
  }

  /**
   * Returns a new time object.
   */
  public newTimeObj(): TimeRow {
    const time = new TimeRow();
    time.breaktime = this.DEFAULTBREAKTIME;
    time.location = this.DEFAULTLOCATION;
    return time;
  }

  /**
   * Calculates the worked hours based on the start time and the stop time.
   * TODO: This needs to be checked on the server side.
   * @param time TimeRow
   */
  public calculateWorkedHours(time: TimeRow) {
    const splitStart = time.start.split(':', 2);
    const splitStop = time.stop.split(':', 2);

    // Create dateobjects
    const start = new Date(time.date);
    const end = new Date(time.date);
    start.setHours(parseInt(splitStart[0], null) , parseInt(splitStart[1], null));
    end.setHours(parseInt(splitStop[0], null), parseInt(splitStop[1], null));

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
  public loadRecentTimes(): Subscription {
    return this.http.get<TimeRow[]>('/time/get/recent?user_id=' + this.authService.currentUserValue.id)
      .subscribe(data => {
        if (data.length >= 0) {
          this.recentTimes = data;
          this.recentTimesChanged.emit(this.recentTimes);
        }
      }, error => {
        // Handled by HTTP interceptor: ErrorInterceptor
      });
  }

  /**
   * Admin
   * Loads recent times registered by the user. Api set's the max values of rows on 10.
   */
  public loadAllTimes(): Observable<TimeRow[]> {
    return this.http.get<TimeRow[]>('/time/get/all?user_id=' + this.authService.currentUserValue.id);
  }

  /**
   * User
   * ... TODO doc
   */
  public loadAllTimesForYear(year: number): Observable<TimeRow[]> {
    return this.http.get<TimeRow[]>('/time/get/all?user_id=' + this.authService.currentUserValue.id + '&year=' + year);
  }

  /**
   * User
   * ... TODO doc
   */
  public loadRegistrationYears(): Observable<any> {
    return this.http.get<number[]>('/time/get/years?user_id=' + this.authService.currentUserValue.id);
  }

  public formatDate(date: string): string {
    const dtFormat = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    const d = new Date(date);
    return dtFormat.format(d);
  }

  getBreakName(num: number) {
    if (num === 0) {
      return 'Geen';
    } else {
      return String(num) + ' Minuten';
    }
  }
}
