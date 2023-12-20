import {Component, OnInit} from '@angular/core';
import {ChartType} from 'chart.js';
import {ChartdataService} from '../../../shared/services/chartdata.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {LocationService} from '../../../shared/services/location.service';
import {environment} from '../../../../environments/environment';
import {SettingModel} from '../../../shared/models/setting.model';
import {SettingService} from '../../../shared/services/setting.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Setting vars for the dashboard component.
  public settingData: SettingModel[];
  public settingCache: {[key: string]: any} = {};

  // Chart vars
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

  // [month, hours, year]
  public statsBestMonthData: [string, number, number] = ['', 0, 0];
  public statsTotalHoursSpend = 0;
  public statsExpectedGrossIncome = 0;

  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';

  public filterYearSelection = 0;
  public filterLocationSelection = '--'; // Start value of selection.

  constructor(private chartDataService: ChartdataService, private spinner: NgxSpinnerService, public locationService: LocationService,
              private route: ActivatedRoute) {

    // Reads the settingData from the RouteResolver, see SettingDataResolver.
    this.route.data.subscribe(() => {
      this.settingData = this.route.snapshot.data.settingData;
    });
  }

  ngOnInit() {
    this.spinner.show('Dashboard data laden...');

    // Initializing setting vars. Need to be done in ngOnInit, because of async data.
    this.settingData.forEach((setting) => {
      switch (setting.name) {
        case SettingService.ENABLE_LOCATION_DASH_RATE:
          // Cast from String to boolean using JSON
          this.settingCache[SettingService.ENABLE_LOCATION_DASH_RATE] = JSON.parse(setting.value);
          break;
      }
    });

    this.locationService.getLocations();
    this.chartDataService.loadChartData();

    this.chartDataService.chartDataEmitter.subscribe(
      (newChartData: []) => {
        this.chartData = newChartData;
        this.loadChartYearsFromData(newChartData);
        this.statsBestMonthData = this.getBestMonthData();
        this.statsTotalHoursSpend = this.getTotalHours();

        if (this.settingCache[SettingService.ENABLE_LOCATION_DASH_RATE]) {
          this.statsExpectedGrossIncome = this.getExpectedGrossIncome();
        }

        this.spinner.hide();
      }
    );
  }

  /**
   * Function will load the chart years from the given chart data.
   * @param chartData
   * @private
   */
  private loadChartYearsFromData(chartData: any[]) {
    chartData.forEach((data) => {
      this.chartYears.push(data.label);
    });
  }

  /**
   * Function will reset the filter selection.
   */
  public onReset() {
    this.filterYearSelection = 0;
    this.filterLocationSelection = '--';
  }

  public onSubmit() {
    alert('This is a work in progress.');
  }

  protected readonly environment = environment;

  /**
   * Gets the best month data. As a Tuple [string, number] == [month, hours].
   * Gets the data from the loaded month data.
   */
  public getBestMonthData(): [string, number, number] {
    let bestMonthHours = -1;
    let bestMonthIndex = -1;
    let bestYear = -1;

    this.chartData.forEach(yearData => {
      const currentYear = yearData.label;

      yearData.data.forEach((hours, index) => {
        if (hours > bestMonthHours) {
          bestYear = currentYear;
          bestMonthIndex = index;
          bestMonthHours = hours;
        }
      });
    });

    // Return the string and hours worked that month.
    return [this.chartLabels[bestMonthIndex], bestMonthHours, bestYear];
  }

  /**
   * Will return chart titles so the user haves more visuals to indicate which month they are looking at.
   */
  public getChartTitles(): string {
    // Get chart title based on filterLocationSelection
    if (!(this.filterLocationSelection === '--') && !(this.filterLocationSelection === '')) {
      return this.filterLocationSelection;
    }

    return 'Alle data';
  }

  /**
   * Function will return estimated gross income for the current selection in the dashboard.
   */
  public getExpectedGrossIncome() {
    // TODO
    return 0;
  }

  /**
   * Calculate total hours per year from the provided array of yearly data.
   * @returns An variable containing total hours.
   */
  public getTotalHours(): number {
    let totalHours = 0; // Object to store total hours per year

    // looping over each year and simple reducing the array with all the hours.
    for (const yearData of this.chartData) {
      totalHours += yearData.data.reduce((accumulator, current) => accumulator + current, 0);
    }

    return totalHours;
  }
}
