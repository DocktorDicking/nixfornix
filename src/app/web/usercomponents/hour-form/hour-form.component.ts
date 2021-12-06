import { Component, OnInit } from '@angular/core';
import { TimeRow } from '../../../shared/models/timeRow.model';
import { TimeService } from '../../../shared/services/time.service';

@Component({
  selector: 'app-hour-form',
  templateUrl: './hour-form.component.html',
  styleUrls: ['./hour-form.component.css'],
  providers: []
})
export class HourFormComponent implements OnInit {
  public time: TimeRow;
  breaktimes = [0, 15, 30, 45, 60];
  message: string;

  constructor(private timeService: TimeService) {
  }

  ngOnInit() {
    this.time = this.timeService.newTimeObj();
  }

  submitTime() {
    if (this.timeFormValidation(this.time)) {
      this.timeService.onRegisterTime(this.time);
      this.time = this.timeService.newTimeObj();
    } else {
      // TODO: I think this can be deleted?
      setTimeout(() => {
        this.message = undefined;  // TODO: Add directive to error msges and fadeout after 4 seconds.
      }, 5000);
    }
  }

  getBreakName(num: number) {
    if (num === 0) {
      return 'Geen';
    } else {
      return String(num) + ' Minuten';
    }
  }

  timeFormValidation(time: TimeRow): boolean {
    if (!time) {
      this.message = 'Foutmelding: Tijd object is leeg. ' +
        'Probeer het nogmaals of neem contact op met de beheerder.'; // TODO: Something more sensible for the user?
      return false;
    }

    // TODO Wot?!
    const date = new Date(time.date);
    if (!(date.getTime() === date.getTime())) {
      this.message = 'Datum is niet valide of is leeg. Schrijf datum als: dag / maand / jaar.';
      return false;
    }

    if (!time.start) {
      this.message = 'Begintijd is een verplicht veld. ';
      return false;
    }

    if (!time.stop) {
      this.message = 'Eindtijd is een verplicht veld. ';
      return false;
    }

    if (time.start === time.stop) {
      this.message = 'Ingevoerde werktijd, van/tot niet valide.';
      return false;
    }

    this.timeService.calculateWorkedHours(time);
    if (time.hour >= 22) {
      this.message = 'Totale tijd overschrijdt het maximum.';
      return false;
    }

    return true;
  }
}
