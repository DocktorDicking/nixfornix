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
  ERROR_BADCREDENTIALS = 'Unauthorized';
  ERROR_BADJWT = 'JWT signature does not match locally computed signature. ' +
    'JWT validity cannot be asserted and should not be trusted.';
  ERROR_OLDJWT = 'JWT signature does not match locally computed signature. ' +
    'JWT validity cannot be asserted and should not be trusted.';
  ERROR_NOTIMEFOUND = 'No time found.';

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
    // debugger;
    // TODO: We realy need to redo this whole error handling shite. API needs to send: code, message, and state (error/warning)
    if (response.status === 0) {
      this.toastr.error('Er is een fout op de server. Neem contact op met de beheerder, excuus voor het ongemak.', 'Server Error: API OFFLINE');
    } else {
      switch (response.error.message) {
        case this.ERROR_NOTIMEFOUND:
          break;
        case this.ERROR_BADCREDENTIALS:
          this.auth.logout();
          this.toastr.error(this.getMessage(response.error.error), this.getTitle(response.error.error));
          break;
        case this.ERROR_OLDJWT || this.ERROR_BADJWT:
          this.auth.logout();
          this.toastr.error(this.getMessage(response.error.message), this.getTitle(response.error.message));
          break;
        default:
          const apiMessage = response.error.message;
          const message = this.getMessage(apiMessage);
          if (message) {
            this.toastr.error(message, this.getTitle(apiMessage));
          }
      }
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
        return 'U heeft geen authorisatie om deze handeling uit te voeren. U bent uitgelogd. Probeer opnieuw in te loggen.';
      case 'Approved time error':
        return 'Tijd die geaccordeerd is mag niet worden aangepast.';
      case 'IP blocked for 24h':
        return 'Door meerdere mislukte inlog pogingen is dit IP adress geblokkeerd voor 24 uur.';
      case 'No time found.':
        return 'Er zijn (nog) geen registraties gevonden. Negeer deze melding als er nog geen tijden zijn geregistreerd.';
      case 'JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted.':
        return 'De eerder opgeslagen beveiligingssleutel is niet valide. De sleutel is verwijderd, probeer nogmaals in te loggen.';
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
      case 'Approved time error':
        return 'Approved time error';
      case 'IP blocked for 24h':
        return 'IP is geblokkeerd.';
      case 'No time found.':
        return 'Geen tijd registraties gevonden.';
      case 'JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted.':
        return 'Automatisch inloggen mislukt.';
      default:
        return apiMessage;
    }
  }
}
