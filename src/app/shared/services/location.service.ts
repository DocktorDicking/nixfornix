import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {WorkLocation} from '../models/worklocation.model';
import {Subscription} from 'rxjs';

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
}
