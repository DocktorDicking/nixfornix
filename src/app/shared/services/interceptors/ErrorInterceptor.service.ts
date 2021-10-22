import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MessageService} from '../message.service';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../auth.service';

/**
 * Checks all HTTP requests on errors.
 */
@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private messageService: MessageService, private toastr: ToastrService, private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(catchError(err => {
        if (err instanceof HttpErrorResponse) {
          this.onError(err);
        }
        return throwError(err);
      }));
  }

  /**
   * Sets message in message service so it can be send to the component currently active.
   */
  private onError(response: HttpErrorResponse): void {
    // TODO we are going to change all messaging to toastr, so we need to replace the whole message service and nuke it.
    if (response.error.error === 'Unauthorized') {
      this.auth.logout();
      this.toastr.error(this.getMessage('Unauthorized'), this.getTitle('Unauthorized'));
    } else {
      const apiMessage = response.error.message;
      const message = this.getMessage(apiMessage);
      if (message) {
        this.toastr.error(message, this.getTitle(apiMessage));
      }

      // this.messageService.changeMessage(message);
    }
  }

  /**
   * For now a translator method. Will do something with translation lateron to centralize it i guess?
   */
  private getMessage(apiMessage: string) {
    switch (apiMessage) {
      case 'Bad credentials':
        return 'Gebruikersnaam of wachtwoord incorrect.';
      case 'User is disabled':
        return 'Inloggen is niet mogelijk. Dit account is niet actief.';
      case 'Unauthorized':
        return 'Je heb geen authorisatie om deze handeling uit te voeren. Je bent uitgelogd. Probeer opnieuw in te loggen.';
      default:
        return apiMessage;
    }
  }

  /**
   * For now a translator method. Will do something with translation lateron to centralize it i guess?
   */
  private getTitle(apiMessage: string) {
    switch (apiMessage) {
      case 'Bad credentials':
        return 'Inloggen mislukt.';
      case 'User is disabled':
        return 'Account non-actief';
      case 'Unauthorized':
        return 'Geen authorisatie';
      default:
        return apiMessage;
    }
  }
}
