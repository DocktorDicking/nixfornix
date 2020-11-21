import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

/**
 * Service that holds messages in a basic form. For now it serves as a bridge between
 * the ErrorInterceptor and Auth and lateron for other services also.
 *
 * Components that expect a message subscribe to the currentMessage.
 */
@Injectable()
export class MessageService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  clearMessage() {
    this.messageSource.next('');
  }
}
