import { Component, OnInit } from '@angular/core';
import {ChartType} from 'chart.js';
import {ChartdataService} from '../../../shared/services/chartdata.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {LocationService} from '../../../shared/services/location.service';
import {WorkLocation} from '../../../shared/models/worklocation.model';
import {environment} from '../../../../environments/environment';

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
  public chartYears = [];
  /*
  Object: {data array, label string}
  data array: [num, num, num ... ]
   */

  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';

  public filterYearSelection = 0;
  public filterLocationSelection = '';

  constructor(private chartDataService: ChartdataService, private spinner: NgxSpinnerService, public locationService: LocationService) { }

  ngOnInit() {
    this.spinner.show('Dashboard data laden...');
    this.locationService.getLocations();
    this.chartDataService.loadChartData();
    this.chartDataService.chartDataEmitter.subscribe(
      (newChartData: []) => {
        this.chartData = newChartData;
        this.loadChartYearsFromData(newChartData);
        this.spinner.hide();
      }
    );
  }

  private loadChartYearsFromData(chartData: any[]) {
    chartData.forEach((data) => {
      this.chartYears.push(data.label);
    });
  }

  public onReset() {
    this.filterYearSelection = 0;
    this.filterLocationSelection = '';
  }

  public onSubmit() {
    alert('TODO');
  }

  protected readonly environment = environment;
}
