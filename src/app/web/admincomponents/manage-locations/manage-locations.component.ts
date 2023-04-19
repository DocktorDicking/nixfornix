import { Component, OnInit } from '@angular/core';
import {LocationService} from '../../../shared/services/location.service';
import {AuthService} from '../../../shared/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {WorkLocation} from '../../../shared/models/location.model';
import {element} from 'protractor';

@Component({
  selector: 'app-manage-locations',
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.css']
})
export class ManageLocationsComponent implements OnInit {
  public selected: WorkLocation = new WorkLocation(0);

  constructor(public locationService: LocationService, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    this.locationService.getLocations();
  }

  onLocationData(id: number) {

  }

  resetSelected() {
    this.selected = new WorkLocation(0);
  }

  doesSelectedExist(): boolean {
    if (this.locationService.data.length > 0) {
      if (this.locationService.data.findIndex((location) => {location.id === this.selected.id; })) {
        return true;
      }
    }
    return false;
  }

  onDelete() {

  }

  isNew() {
    return this.doesSelectedExist();
  }

  onSave() {

  }
}
