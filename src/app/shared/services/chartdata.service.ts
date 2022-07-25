import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {Subscription} from 'rxjs';

/**
 * Service for retrieving data for the dashboard.
 */
@Injectable()
export class ChartdataService {
  private chartCacheEmitter = new EventEmitter<any[]>();
  public chartDataEmitter = new EventEmitter<any[]>();
  private chartCache = [];
  private chartData = [];

  constructor(private http: HttpClient) {
  }

  /**
   * Sends the request to fetch the chartData from the server.
   */
  private fetchChartData(): Subscription {
    return this.http.get<any>('/time/get/chartdata')
      .subscribe(data => {
        if (data.length >= 0) {
          this.chartCache = data;
          this.chartCacheEmitter.emit(this.chartCache);
        }
      }, error => {
        // Handled by HTTP interceptor: ErrorInterceptor
      });
  }

  /**
   * Uses the private fetchChartData() to get the data from the service.
   * Uses the retrieved data and converts the data in a format that is required by chartJS
   *
   * Saves the data in the chartData array and emits the array using a EvenEmitter when the data is loaded and
   * ready for use. dashboard.component.ts uses a subscription on the EventEmitter.
   *
   * Data structure that is created by this method looks like:
   * [{label: year, data: [hours, hours, hours, ...]},{...}]
   *
   * The data array always contains 12 elements, one for each month.
   */
  public loadChartData() {
    this.fetchChartData();
    this.chartCacheEmitter.subscribe(
      (cache: []) => {
        cache.forEach((row: any) => {
          if (this.chartData.length > 0 && this.chartYearExists(row.year)) {
            this.chartData.forEach((chartDataObj) => {
              if (chartDataObj.label === row.year) {
                const index = row.month - 1;
                chartDataObj.data[index] = row.hours;
              }
            });
          } else {
            const obj = {
              label: undefined,
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            };

            const index = row.month - 1;
            obj.label = row.year;
            obj.data[index] = row.hours;
            this.chartData.push(obj);
          }
        });
        this.chartDataEmitter.emit(this.chartData);
      }
    );
  }

  /**
   * Because typescript does not let you check if an array contains a property in any other way.
   * Creates a new object and sets the label of a dataset.
   *
   * @param year the year for which we want to know if a property exists.
   * @private
   */
  private chartYearExists(year: number): boolean {
    return this.chartData.some( (row) => {
      return row.label === year;
    });
  }
}
