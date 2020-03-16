import {Component, OnInit} from '@angular/core';
import {TimeRow} from '../../shared/models/timeRow.model';
import {TimeService} from '../../shared/services/time.service';

@Component({
  selector: 'app-hour-form',
  templateUrl: './hour-form.component.html',
  styleUrls: ['./hour-form.component.css'],
  providers: []
})
export class HourFormComponent implements OnInit {
  private time: TimeRow;
  breaktimes = [0, 15, 30, 45, 60];
  message: string;

  submitTime() {
    if (this.timeFormValidation(this.time)) {
      this.timeService.onRegisterTime(this.time);
      this.time = this.timeService.newTimeObj();
    } else {
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
      this.message = 'Tijd object is leeg. Kan dit formulier niet opslaan.'; // TODO: Something more sensible for the user?
      return false;
    }

    const date = new Date(time.date);
    if (!(date.getTime() === date.getTime())) {
      this.message = 'Datum is niet valide of is leeg.';
      return false;
    }

    if (!time.startTime) {
      this.message = 'Begintijd is een verplicht veld. ';
      return false;
    }

    if (!time.stopTime) {
      this.message = 'Eindtijd is een verplicht veld. ';
      return false;
    }

    if (time.startTime === time.stopTime) {
      this.message = 'Pardon.. je heb 24 uur gewerkt?'; // TODO: Change to something nice
      return false;
    }
    return true;
  }

  constructor(private timeService: TimeService) {
  }

  ngOnInit() {
    this.time = this.timeService.newTimeObj();
  }

}
