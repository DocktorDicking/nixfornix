import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dlessShortTime'
})
export class DatelessShortTime implements PipeTransform {
  readonly SECONDS_FROM_TIMESTRING = 3;

  transform(value: string): string {
    if (value.length === 8) {
      return value.substr(0, value.length - this.SECONDS_FROM_TIMESTRING);
    } else {
      return value;
    }
  }
}
