import { Component, OnInit } from '@angular/core';
import {LocationService} from '../../../shared/services/location.service';
import {AuthService} from '../../../shared/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {WorkLocation} from '../../../shared/models/worklocation.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {environment} from '../../../../environments/environment';
import {SettingModel} from '../../../shared/models/setting.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingService} from '../../../shared/services/setting.service';

@Component({
  selector: 'app-manage-locations',
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.css']
})
export class ManageLocationsComponent implements OnInit {
  // Setting vars for the dashboard component.
  public settingData: SettingModel[];
  public settingCache: {[key: string]: any} = {};

  // Location var that holds the selected location.
  public selected: WorkLocation = new WorkLocation(0);

  constructor(public locationService: LocationService, private authService: AuthService, private toastr: ToastrService,
              private spinner: NgxSpinnerService, private route: ActivatedRoute, private router: Router) {

    // Reads the settingData from the RouteResolver, see SettingDataResolver.
    this.route.data.subscribe(() => {
      this.settingData = this.route.snapshot.data.settingData;
    });
  }

  ngOnInit() {
    // Initializing setting vars. Need to be done in ngOnInit, because of async data.
    this.settingData.forEach((setting) => {
      switch (setting.name) {
        case SettingService.ENABLE_LOCATION_DASH_RATE:
          // Cast from String to boolean using JSON
          this.settingCache[SettingService.ENABLE_LOCATION_DASH_RATE] = JSON.parse(setting.value);
          break;
      }
    });

    if (this.authService.currentUserValue.admin) {
      this.locationService.getLocations();
    } else {
      this.router.navigate(['login']);
    }
  }

  setSelected(id: number) {
    const newSelected = this.locationService.data.find(loc => loc.id === id);
    if (newSelected) {
      this.selected = new WorkLocation(null, newSelected);
    }
  }

  resetSelected() {
    this.selected = new WorkLocation(0);
  }

  /**
   * Checks the loaded location data array if the current selected location (selected in the table) exists.
   * This function is used by some buttons that are only applicable for existing selections.
   * No selection, does not exist. Therefor the buttons are not needed.
   */
  doesSelectedExist(): boolean {
    if (this.locationService.data.length > 0) {
      if (this.locationService.data.find(loc => loc.id === this.selected.id)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Deletes the selected location.
   */
  onDelete() {
    this.spinner.show();
    if (this.doesSelectedExist()) {
      this.locationService.onDelete(this.selected).then(res => {
        if (res.statusCode === 200) {
          const oldLocationName = this.selected.name;
          this.resetSelected();
          this.locationService.getLocations();
          this.spinner.hide();
          this.toastr.success('Locatie ' + oldLocationName + ' is succesvol verwijderd.');
        } else {
          this.spinner.hide();
          this.toastr.error('Locatie kon niet worden verwijderd.' +
            'Probeer het nogmaals of neem contact op met de beheerder.');
        }
      }).catch(err => {
        this.spinner.hide();
        this.toastr.error('Locatie kon niet worden verwijderd.' +
          'Probeer het nogmaals of neem contact op met de beheerder.');
        // Handled by HTTP interceptor: ErrorInterceptor
      });
    }
  }

  isNew() {
    return !this.doesSelectedExist();
  }

  onSave() {
    this.spinner.show();
    this.sanatizeRateString();
    if (this.isNew()) {
      this.locationService.onCreate(this.selected).then(res => {
        if (res.statusCode === 200) {
          this.locationService.getLocations();
          // this.closeTimeModel();
          this.spinner.hide();
          this.toastr.success('Nieuwe locatie succesvol toegevoegd.');
        } else {
          this.spinner.hide();
          this.toastr.error('Er is een fout opgetreden. Probeer het nogmaals of neem contact op met de beheerder.');
        }
      }).catch(err => {
        // Handled by HTTP interceptor.
        // this.closeTimeModel();
        this.spinner.hide();
        this.toastr.error('Er is een fout opgetreden. Probeer het nogmaals of neem contact op met de beheerder.');
      });
    } else {
      this.locationService.onUpdate(this.selected).then(res => {
        if (res.statusCode === 200) {
          this.locationService.getLocations();
          // this.closeTimeModel();
          this.spinner.hide();
          this.toastr.success('Locatie succesvol geüpdatet.');
        } else {
          this.spinner.hide();
          this.toastr.error('Er is een fout opgetreden. Probeer het nogmaals of neem contact op met de beheerder.');
        }
      }).catch(err => {
        // Handled by HTTP interceptor.
        // this.closeTimeModel();
        this.spinner.hide();
        this.toastr.error('Er is een fout opgetreden. Probeer het nogmaals of neem contact op met de beheerder.');
      });
    }
  }

  /**
   * Sanatize the rate inputfield and make sure it is an acceptable number.
   * The html input field with type number does not allow for comma's.
   */
  sanatizeRateString() {
    if (this.selected.rate) {
      // Replace comma with period and remove non-numeric characters except periods
      const sanitizedValue = this.selected.rate.replace(/,/g, '.').replace(/[^\d.]/g, '');

      // Parse the sanitized string to a number
      const parsedNumber = parseFloat(sanitizedValue);

      // Return the parsed number or null if parsing fails
      isNaN(parsedNumber) ? this.selected.rate = null : this.selected.rate = parsedNumber;
    }
  }


  protected readonly environment = environment;
  protected readonly SettingService = SettingService;
}
