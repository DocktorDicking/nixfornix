import {Component, OnInit} from '@angular/core';
import {TimeRow} from '../../../shared/models/timeRow.model';
import {TimeService} from '../../../shared/services/time.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {LocationService} from '../../../shared/services/location.service';

@Component({
  selector: 'app-hour-table-total',
  templateUrl: './hour-table-total.component.html',
  styleUrls: ['./hour-table-total.component.css']
})
export class HourTableTotalComponent implements OnInit {
  public modalDataAvailable = false;
  public modalTime: TimeRow = new TimeRow();
  public registrationYears: number[] = [];
  public activeYear: number;
  public times: TimeRow[] = [];

  constructor(public timeService: TimeService, private toastr: ToastrService, private spinner: NgxSpinnerService, public locationService: LocationService) {
  }

  // TODO this will now break when the user does not have any registrations.

  ngOnInit() {
    this.timeService.loadRegistrationYears().toPromise().then((yearData: number[]) => {
      this.activeYear = yearData[0];
      this.loadTimeData(this.activeYear);
      this.registrationYears = yearData;
    }).catch(err => {
      // Handled by HTTP interceptor: ErrorInterceptor
    });
    this.locationService.getLocations();
  }

  public updateTime(time: TimeRow) {
    this.spinner.show();
    this.timeService.onUpdateTime(time).then(res => {
      if (res.statusCode === 200) {
        this.loadTimeData(this.activeYear);
        this.closeTimeModel();
        this.spinner.hide();
        this.toastr.success('De registratie is succesvol geüpdatet.', 'Registratie geüpdatet');
      } else {
        this.spinner.hide();
        this.toastr.error('Registratie kon niet worden geüpdatet.' +
          'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      }
    }).catch(err => {
      this.spinner.hide();
      this.toastr.error('Registratie kon niet worden geüpdatet.' +
        'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      // Handled by HTTP interceptor: ErrorInterceptor
    });
  }

  /**
   * Changes active year so that the UI can change based on this event, This method also triggers
   * loadTimeData to reload data based on the new given year.
   * @param year number
   */
  public onYearChange(year: number) {
    this.activeYear = year;
    this.loadTimeData(year);
  }

  public openTimeModal(time: TimeRow) {
    this.modalTime = Object.assign({}, time);
    this.locationService.addLocationFromTime(this.modalTime);
    this.modalDataAvailable = true;
  }

  public closeTimeModel() {
    this.modalTime = new TimeRow();
    this.locationService.getLocations();
    this.modalDataAvailable = false;
  }

  // TODO: see if we can change this to res == 200 yada yada
  /**
   * Method to fire wanted data reload behavior. This will fetch the user's registrations
   * based on the given year.
   * @param year number
   */
  private loadTimeData(year: number) {
    this.spinner.show();
    this.timeService.loadAllTimesForYear(year).toPromise().then((timeData: TimeRow[]) => {
      this.times = timeData;
      this.spinner.hide();
    }).catch(err => {
      this.spinner.hide();
    });
  }
}
