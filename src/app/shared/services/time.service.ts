import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {TimeRow} from '../models/timeRow.model';
import {AuthService} from './auth.service';
import {ToastrService} from 'ngx-toastr';
import {Observable, Subscription} from 'rxjs';

@Injectable()
export class TimeService {
  public recentTimesChanged = new EventEmitter<TimeRow[]>();
  private recentTimes: TimeRow[] = [];

  private readonly DEFAULTBREAKTIME = 30; // TODO: Move to settings file or something alike.
  private readonly DEFAULTLOCATION = 'Luca Catering'; // TODO: Change to numeric value and move to settingsfile
  public readonly BREAKTIMES = [0, 15, 30, 45, 60]; // TODO: Move to settingsfile

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) {}

  /**
   * Registered a time row.
   */
  onRegisterTime(timeRow: TimeRow) {
    // add the user id to this time row.
    timeRow.user = this.authService.currentUserValue;
    this.calculateWorkedHours(timeRow);
    const timePayload = this.getPayload(timeRow);

    return this.http.post<any>('/time/create', timePayload).toPromise();
  }

  /**
   * Updates a TimeRow.
   */
  onUpdateTime(timeRow: TimeRow) {
    this.calculateWorkedHours(timeRow);
    const timePayload = this.getPayload(timeRow);

    return this.http.post<any>('/time/update', timePayload)
      .toPromise();
      // .then( res => {
      //   if (res.statusCode === 200) {
      //
      //     // TODO: This is a tmp fix. We need to rewrite this anyway when sorting registration data on year/month/day
      //     // if (this.authService.currentUserValue.id === timeRow.user.id) {
      //     //   this.loadAllTimes(); // user all table
      //     // } else {
      //     //   this.loadRecentTimes(); // admin recent table
      //     //   this.loadAllTimes(); // admin all table
      //     // }
      //
      //     if (this.authService.currentUserValue.admin) {
      //       this.toastr.success('De registratie van ' + timeRow.user.name + ' is succesvol geüpdatet.', 'Registratie geüpdatet');
      //     } else {
      //       this.toastr.success('De registratie is succesvol geüpdatet.', 'Registratie geüpdatet');
      //     }
      //   } else {
      //     this.toastr.error('Registratie kon niet worden geüpdatet.' +
      //       'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      //   }
      // }).catch(err => {
      //   this.toastr.error('Registratie kon niet worden geüpdatet.' +
      //     'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      //   // Handled by HTTP interceptor: ErrorInterceptor
      // });
  }

  public onDeleteTime(timeRow: TimeRow) {
    const timePayload = this.getPayload(timeRow);
    return this.http.post<any>('/time/delete', timePayload).toPromise();
  }

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

  // TODO: let server handle this or check everytime just to be sure.
  public calculateWorkedHours(time: TimeRow) {
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
  public loadRecentTimes(): Subscription {
    return this.http.get<TimeRow[]>('/time/get/recent?user_id=' + this.authService.currentUserValue.id)
      .subscribe(data => {
        if (data.length >= 0) {
          this.recentTimes = data;
          this.recentTimesChanged.emit(this.recentTimes);
        }
      });
  }

  public autoLoadRecentTimes() {
    this.loadRecentTimes();
    this.toastr.info('Recent geregistreerde tijden zijn automatisch ververst', 'Automatische verversing');
  }

  /**
   * Loads recent times registered by the user. Api set's the max values of rows on 10.
   */
  public loadAllTimes(): Observable<TimeRow[]> {
    // return this.http.get<TimeRow[]>('/time/get/all?user_id=' + this.authService.currentUserValue.id)
    //   .subscribe(data => {
    //     if (data.length >= 0) {
    //       this.allTimes = data;
    //       this.allTimesChanged.emit(this.allTimes);
    //     }
    //   });

    return this.http.get<TimeRow[]>('/time/get/all?user_id=' + this.authService.currentUserValue.id);
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
