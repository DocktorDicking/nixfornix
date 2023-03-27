import { Component, OnInit } from '@angular/core';
import {AdminLogService} from '../../../shared/services/adminlog.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-admin-log',
  templateUrl: './admin-log.component.html',
  styleUrls: ['./admin-log.component.css']
})
export class AdminLogComponent implements OnInit {

  public logData = [];

  constructor(private adminLogService: AdminLogService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show('Logboek data laden...');
    this.adminLogService.fetchLog();
    this.adminLogService.logDataEmitter.subscribe((newLogData: []) => {
      this.logData = newLogData;
      this.spinner.hide();
    });
  }
}
