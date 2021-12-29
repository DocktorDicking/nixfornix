import {Component, OnInit} from '@angular/core';
import {TimeRow} from '../../../shared/models/timeRow.model';
import {TimeService} from '../../../shared/services/time.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-hour-table-total',
  templateUrl: './hour-table-total.component.html',
  styleUrls: ['./hour-table-total.component.css']
})
export class HourTableTotalComponent implements OnInit {
  public modalDataAvailable = false;
  public modalTime: TimeRow = new TimeRow();
  public times: TimeRow[] = [];

  constructor(public timeService: TimeService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.loadTimeData();
  }

  public updateTime(time: TimeRow) {
    this.timeService.onUpdateTime(time).then(res => {
      if (res.statusCode === 200) {
        this.loadTimeData();
        this.closeTimeModel();
        this.toastr.success('De registratie is succesvol geüpdatet.', 'Registratie geüpdatet');
      } else {
        this.toastr.error('Registratie kon niet worden geüpdatet.' +
          'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      }
    }).catch(err => {
      this.toastr.error('Registratie kon niet worden geüpdatet.' +
        'Probeer het nogmaals of neem contact op met de beheerder.', 'Foutmelding: registratie kan niet worden geüpdatet');
      // Handled by HTTP interceptor: ErrorInterceptor
    });
  }

  public openTimeModal(time: TimeRow) {
    this.modalTime = Object.assign({}, time);
    this.modalDataAvailable = true;
  }

  public closeTimeModel() {
    this.modalTime = new TimeRow();
    this.modalDataAvailable = false;
  }

  private loadTimeData() {
    this.timeService.loadAllTimes().toPromise().then((timeData: TimeRow[]) => {
      this.times = timeData;
    });
  }
}
