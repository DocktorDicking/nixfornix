import {HttpErrorResponse} from '@angular/common/http';

/**
 *
 */
export class ErrorObj {
  private _havesError: boolean;
  private _errorMessage: string;
  private _errorCode: number;
  private _errorTrace: Array<string>;

  constructor() {
    this.havesError = false;
    this.errorMessage = '';
  }

  public setErrorObj(response: HttpErrorResponse) {
    this.errorCode = response.status;
    this.errorTrace = response.error.errors;
    this.havesError = true;
    this.errorMessage = response.error.message;
  }

  public clear() {
    this.havesError = false;
    this.errorCode = undefined;
    this.errorMessage = undefined;
    this.errorTrace = undefined;
  }

  get havesError(): boolean {
    return this._havesError;
  }

  set havesError(value: boolean) {
    this._havesError = value;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  set errorMessage(value: string) {
    this._errorMessage = value;
  }

  get errorCode(): number {
    return this._errorCode;
  }

  set errorCode(value: number) {
    this._errorCode = value;
  }

  get errorTrace(): Array<string> {
    return this._errorTrace;
  }

  set errorTrace(value: Array<string>) {
    this._errorTrace = value;
  }
}
