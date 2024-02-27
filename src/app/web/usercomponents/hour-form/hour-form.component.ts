import {Component, OnInit} from '@angular/core';
import {TimeRow} from '../../../shared/models/timeRow.model';
import {TimeService} from '../../../shared/services/time.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {LocationService} from '../../../shared/services/location.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-hour-form',
  templateUrl: './hour-form.component.html',
  styleUrls: ['./hour-form.component.css'],
  providers: []
})
export class HourFormComponent implements OnInit {
  private settingData;
  public time: TimeRow;
  message: string;

  constructor(public timeService: TimeService, private toastr: ToastrService, public locationService: LocationService,
              private spinner: NgxSpinnerService, private route: ActivatedRoute, private authService: AuthService) {
    // Reads the settingData from the RouteResolver, see SettingDataResolver.
    this.route.data.subscribe(() => {
      this.settingData = this.route.snapshot.data.settingData;
    });
  }

  ngOnInit() {
    this.timeService.initialize(this.settingData);
    this.time = this.timeService.newTimeObj();
    this.locationService.getLocations();
  }

  submitTime() {
    this.spinner.show();

    if (this.validDeadline(this.time)) {
      if (this.timeFormValidation(this.time)) {
        this.timeService.onRegisterTime(this.time).then(res => {
          if (res.statusCode === 200) {
            this.timeService.loadRecentTimes();
            this.time = this.timeService.newTimeObj();
            this.spinner.hide();
            this.toastr.success('Uren zijn succesvol geregistreerd.');
          } else {
            this.spinner.hide();
            this.toastr.error('Er is iets fout gegaan tijdens het opslaan van jou uren. ' +
              'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: uren konden niet worden opgeslagen');
          }
        }).catch(err => {
          this.spinner.hide();
          this.toastr.error('Er is iets fout gegaan tijdens het opslaan van jou uren. ' +
            'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: uren konden niet worden opgeslagen');
          // Handled by HTTP interceptor: ErrorInterceptor
        });
      } else {
        this.spinner.hide();
        setTimeout(() => {
          this.message = undefined;  // TODO: Add directive to error msges and fadeout after 4 seconds.
        }, 5000);
      }
    }
    this.spinner.hide();
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
    if (time.hour >= 22) { // TODO This magic number needs to be moved ot the settings table.
      this.message = 'Totale tijd overschrijdt het maximum.';
      return false;
    }

    return true;
  }

  private validDeadline(timeRow: TimeRow): boolean {
    // Deadline will be false when set to 0 (zero) in the settings panel and this will be skipped.
    if (this.timeService.DEADLINE && !this.authService.currentUserValue.admin) {
      const hours = timeRow.start.substr(0, 2);
      const minutes = timeRow.start.substr(timeRow.start.length - 2);

      const timeDate = new Date(timeRow.date);
      timeDate.setHours(Number(hours));
      timeDate.setMinutes(Number(minutes));
      const currentDateTime = new Date();

      const diffMilliseconds = currentDateTime.getTime() - timeDate.getTime();
      const diffHours = diffMilliseconds / (1000 * 60 * 60);

      if (diffHours < this.timeService.DEADLINE) {
        return true;
      }

      this.toastr.warning('Uren dienen binnen ' + this.timeService.DEADLINE + ' uren geregistreerd te worden.', 'Registratie mislukt');
      return false;
      // Calc hours between given date and now().
      // Is the amount of hours within the deadline hours?
    }

    return true;
  }

  public readonly environment = environment;
}
