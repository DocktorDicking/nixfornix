import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {Subscription} from 'rxjs';

/**
 * Service for retrieving data for the adminlog.
 */
@Injectable()
export class AdminLogService {
  public logDataEmitter = new EventEmitter<any[]>();
  private logData = [];

  constructor(private http: HttpClient) {
  }

  /**
   * Sends the request to fetch the logData from the server.
   */
  public fetchLog(): Subscription {
    return this.http.get<any>('/log/get')
      .subscribe(data => {
        if (data.length >= 0) {
          this.logData = data;
          this.logDataEmitter.emit(this.logData);
        }
      }, error => {
        // Handled by HTTP interceptor: ErrorInterceptor
      });
  }
}
