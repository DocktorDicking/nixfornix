import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Location} from '../models/location.model';
import {Subscription} from 'rxjs';

@Injectable()
export class LocationService {
  dataEmitter = new EventEmitter<Location[]>();
  public data: Location[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService,
              private spinner: NgxSpinnerService) {
  }

  public getLocations(): Subscription {
    return this.http.get<Location[]>('/location/get')
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
  public onCreate(location: Location): Promise<any> {
    return this.http.post<any>('/location/create', location).toPromise();
  }

  /**
   *
   * @param location Location.model
   */
  public onUpdate(location: Location): Promise<any> {
    return this.http.post<any>('/location/update', location).toPromise();
  }

  /**
   *
   * @param location Location.model
   */
  public onDeleteTime(location: Location): Promise<any> {
    return this.http.post<any>('/location/delete', location).toPromise();
  }
}
