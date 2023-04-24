import { Component, OnInit } from '@angular/core';
import {LocationService} from '../../../shared/services/location.service';
import {AuthService} from '../../../shared/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {WorkLocation} from '../../../shared/models/worklocation.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-manage-locations',
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.css']
})
export class ManageLocationsComponent implements OnInit {
  public selected: WorkLocation = new WorkLocation(0);

  constructor(public locationService: LocationService, private authService: AuthService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    if (this.authService.currentUserValue.admin) {
      this.locationService.getLocations();
    } else {
      // TODO redirect
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

}
