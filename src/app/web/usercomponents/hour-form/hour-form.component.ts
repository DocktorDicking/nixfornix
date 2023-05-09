import {Component, OnInit} from '@angular/core';
import {TimeRow} from '../../../shared/models/timeRow.model';
import {TimeService} from '../../../shared/services/time.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {WorkLocation} from '../../../shared/models/worklocation.model';
import {LocationService} from '../../../shared/services/location.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-hour-form',
  templateUrl: './hour-form.component.html',
  styleUrls: ['./hour-form.component.css'],
  providers: []
})
export class HourFormComponent implements OnInit {
  private settingData;
  public time: TimeRow;
  public breaktimes = [];
  message: string;

  constructor(private timeService: TimeService, private toastr: ToastrService, private locationService: LocationService,
              private spinner: NgxSpinnerService, private route: ActivatedRoute) {
    // Reads the settingData from the RouteResolver, see SettingDataResolver.
    this.route.data.subscribe(() => {
      this.settingData = this.route.snapshot.data.settingData;
    });
  }

  ngOnInit() {
    this.timeService.initialize(this.settingData);
    this.breaktimes = this.timeService.BREAKTIMES; // TODO We can reference this from the timeService?
    this.time = this.timeService.newTimeObj();
    this.locationService.getLocations();
  }

  submitTime() {
    this.spinner.show();
    if (this.timeFormValidation(this.time)) {
      this.timeService.onRegisterTime(this.time).then(res => {
        if (res.statusCode === 200) {
          this.timeService.loadRecentTimes();
          this.time = this.timeService.newTimeObj();
          this.spinner.hide();
          this.toastr.success(this.time.hour + ' uren geregistreerd.', 'Jou uren zijn opgeslagen!');
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
}
