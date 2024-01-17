import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Chart, {ChartType} from 'chart.js';
import {ChartdataService} from '../../../shared/services/chartdata.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {LocationService} from '../../../shared/services/location.service';
import {environment} from '../../../../environments/environment';
import {SettingModel} from '../../../shared/models/setting.model';
import {SettingService} from '../../../shared/services/setting.service';
import {ActivatedRoute} from '@angular/router';
import {WorkLocation} from '../../../shared/models/worklocation.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  protected readonly environment = environment;
  protected readonly SettingService = SettingService;

  // Chart elements
  @ViewChild('barChart', null) barElement: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart', null) lineElement: ElementRef<HTMLCanvasElement>;
  private lineChart: Chart;
  private barChart: Chart;

  // Because of how the chartService now works a reset is needed before doing a new submit.
  public submitDisabled = false;

  // Setting vars for the dashboard component.
  public settingData: SettingModel[];
  public settingCache: {[key: string]: any} = {};

  // Chart vars
  public chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      display: true,
      position: 'top',
      labels: {
        fontColor: 'white'
      }
    }
  };
  public chartLabels = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  public chartData = [];
  public chartYears = [];
  /*
  Object: {data array, label string}
  data array: [num, num, num ... ]
   */

  // [month, hours, year]
  public statsBestMonthData: [string, number, number] = ['', 0, 0];
  public statsTotalHoursSpend = 0;
  public statsExpectedGrossIncome;

  public filterYearSelection = 0;
  public filterLocationSelection: WorkLocation = null; // Start value of selection.

  constructor(private chartDataService: ChartdataService, private spinner: NgxSpinnerService, public locationService: LocationService,
              private route: ActivatedRoute, private toastr: ToastrService) {

    // Reads the settingData from the RouteResolver, see SettingDataResolver.
    this.route.data.subscribe(() => {
      this.settingData = this.route.snapshot.data.settingData;
    });

    // Set up the callback function on the subscribe for this emitter. This needs to be called whenever the chartCacheEmitter emits.
    this.chartDataService.chartDataEmitter.subscribe(
      (newChartData: []) => {
        this.spinner.show();
        this.chartData = newChartData;
        this.loadChartYearsFromData(newChartData);
        this.statsBestMonthData = this.getBestMonthData();
        this.statsTotalHoursSpend = this.getTotalHours();

        if (this.settingCache[SettingService.ENABLE_LOCATION_DASH_RATE]) {
          this.statsExpectedGrossIncome = this.getExpectedGrossIncome();
        }

        this.createCharts();
        this.spinner.hide();
      }
    );
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
  }

  createCharts() {
    // Charts need to be destroyed to avoid visual bugs where multiple charts are rendered.
    if (this.lineChart && this.barChart) {
      this.lineChart.destroy();
      this.barChart.destroy();
    }

    if (this.lineElement && this.barElement) {
      this.lineChart = new Chart(this.lineElement.nativeElement.getContext('2d'), {
        type: 'line',
        data: {
          labels: this.chartLabels,
          datasets: this.chartData
        },
        options: this.chartOptions
      });

      this.barChart = new Chart(this.barElement.nativeElement.getContext('2d'), {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: this.chartData
        },
        options: this.chartOptions
      });
    }
  }

  /**
   * Function will load the chart years from the given chart data.
   */
  private loadChartYearsFromData(chartData: any[]) {
    this.chartYears = [];
    chartData.forEach((data) => {
      this.chartYears.push(data.label);
    });
  }

  /**
   * Function will reset the filter selection.
   */
  public onReset() {
    this.filterYearSelection = 0;
    this.filterLocationSelection = null;
    this.submitDisabled = false;
    this.chartDataService.loadChartData();
  }

  /**
   * Because of the way we fetch data and because the filters selectable values are based on this data.
   * We need to reset first before selecting new data. Hence the use of 'submitDisabled' since we want to force the users
   * to reset. The reset will make sure all data is loaded again which results in the filters having all the data (mainly years).
   *
   * The list of selectable years is based on the fetched data. We might want to change this in some future update by loading
   * the years once (during the first data fetch).
   */
  public onSubmit() {
    if (!this.submitDisabled) {
      this.submitDisabled = true;

      // If no location is selected, filterLocationSelection will me null. Thus .id will result in errors.
      const locationId = this.filterLocationSelection ? this.filterLocationSelection.id : null;
      this.chartDataService.loadChartData(this.filterYearSelection, locationId);
    } else {
      this.toastr.warning('Klik eerst op de Reset knop voordat u een nieuwe selectie maakt.');
    }
  }

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
    if (this.filterLocationSelection) {
      return this.filterLocationSelection.name;
    }

    return 'Alle data';
  }

  /**
   * Function will return estimated gross income for the current selection in the dashboard.
   */
  public getExpectedGrossIncome() {
    // Whenever a location is selected we only want to use the rate of that location.
    if (this.filterLocationSelection) {
      return (this.statsTotalHoursSpend * this.filterLocationSelection.rate).toFixed(2);
    }

    // If there is no data, return 0.
    if (this.locationService.data.length === 0) {
      return 0;
    }

    // If there is only one location, return the total hours * location.rate.
    if (this.locationService.data.length === 1) {
      return (this.statsTotalHoursSpend * this.locationService.data[0].rate).toFixed(2);
    }

    // If there are more than one location, return the average rate * total hours.
    if (this.locationService.data.length > 1) {
      let grossRate = 0;
      this.locationService.data.forEach((location) => {
        grossRate += location.rate;
      });

      grossRate = grossRate / this.locationService.data.length;
      return (this.statsTotalHoursSpend * grossRate).toFixed(2);
    }
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
