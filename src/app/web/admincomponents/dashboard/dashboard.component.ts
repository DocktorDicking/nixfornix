import { Component, OnInit } from '@angular/core';
import {ChartType} from 'chart.js';
import {ChartdataService} from '../../../shared/services/chartdata.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public chartLabels = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  public chartLegend = true;
  public chartData = [];
  /*
  Object: {data array, label string}
  data array: [num, num, num ... ]
   */

  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';

  constructor(private chartDataService: ChartdataService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show('Dashboard data laden...');
    this.chartDataService.loadChartData();
    this.chartDataService.chartDataEmitter.subscribe(
      (newChartData: []) => {
        this.chartData = newChartData;
        this.spinner.hide();
      }
    );
  }

}
