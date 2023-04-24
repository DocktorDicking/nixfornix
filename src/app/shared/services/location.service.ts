import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {WorkLocation} from '../models/worklocation.model';
import {Subscription} from 'rxjs';
import {TimeRow} from '../models/timeRow.model';

@Injectable()
export class LocationService {
  dataEmitter = new EventEmitter<WorkLocation[]>();
  public data: WorkLocation[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService,
              private spinner: NgxSpinnerService) {
  }

  public getLocations(): Subscription {
    return this.http.get<WorkLocation[]>('/location/get')
      .subscribe(data => {
        if (data.length >= 0) {
          this.data = data;
          this.dataEmitter.emit(this.data);
        }
      }, error => {
        // Handled by HTTP interceptor: ErrorInterceptor
      });
  }

  /**
   *
   * @param location Location.model
   */
  public onCreate(location: WorkLocation): Promise<any> {
    return this.http.post<any>('/location/create', location).toPromise();
  }

  /**
   *
   * @param location Location.model
   */
  public onUpdate(location: WorkLocation): Promise<any> {
    return this.http.post<any>('/location/update', location).toPromise();
  }

  /**
   *
   * @param location Location.model
   */
  public onDelete(location: WorkLocation): Promise<any> {
    return this.http.post<any>('/location/delete', location).toPromise();
  }

  /**
   * Adds the location from the TimeRegistration to this service it's data array.
   * This is made for when a Location does not exist anymore in the db table.
   * @param time TimeRow
   */
  public addLocationFromTime(time: TimeRow) {
    if (time.location) {
      /*
      Added this hacky adding of locations because whenever a location does not exist in the DB it will not show up
      on registrations that got registered with that location in the past. Which will result in chaos among users.
      This makes sure the old/non existed location is still selectable for only this registration.
       */
      if (!this.data.find(location => location.name === time.location)) {
        const oldLoc = new WorkLocation();
        oldLoc.name = time.location;
        this.data.push(oldLoc);
      }
    }
  }
}
