import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // All HTTP requests are going to go through this method
    console.log('HttpInterceptorService');

    // Get token if there is any
    const token = this.authService.getToken();
    if (token) {
      let newHeaders = req.headers;

      // append new header to headers with token.
      newHeaders = newHeaders.append('Authorization', 'Bearer ' + token);
      // Clone request with new headers. Required because HttpRequests are immutable.
      const newReq = req.clone({ headers: newHeaders});
      return next.handle(newReq);
    }

    // No token, continue
    return next.handle(req);
  }
}
