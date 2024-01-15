import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {ReplaySubject, Subscription} from 'rxjs';

/**
 * Service for retrieving data for the dashboard.
 */
@Injectable()
export class ChartdataService {
  private chartCacheEmitter = new ReplaySubject<any[]>();
  public chartDataEmitter = new ReplaySubject<any[]>();
  private chartCache = [];
  private chartData = [];

  constructor(private http: HttpClient) {
    // Set up the callback function on the subscribe for this emitter. This needs to be called whenever the chartCacheEmitter emits.
    this.chartCacheEmitter.subscribe(
      (cache: []) => {
        if (this.chartData.length > 0) {
          this.chartData = [];
        }

        cache.forEach((row: any, counter) => {
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
              backgroundColor: this.getColor(counter),
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            };

            const index = row.month - 1;
            obj.label = row.year;
            obj.data[index] = row.hours;
            this.chartData.push(obj);
          }
        });

        this.chartDataEmitter.next(this.chartData);
      }
    );
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
  public loadChartData(year?: number, locationId?: number) {
    // If year and locationId are set, fetch the data for that year and location.
    if (year && locationId) {
      this.fetchChartData(year, locationId);
    } else {
      this.fetchChartData();
    }
  }

  /**
   * Sends the request to fetch the chartData from the server.
   */
  private fetchChartData(year?: number, locationId?: number): Subscription {
    // If year and locationId are set, fetch the data for that year and location.
    let httpString = '/chart/get';
    if (year && locationId) { // TODO Split this in year and location.
      httpString = '/chart/get?year=' + year + '&locationId=' + locationId;
    }

    return this.http.get<any>(httpString)
      .subscribe(data => {
        if (data.length >= 0) {
          this.chartCache = data;
          this.chartCacheEmitter.next(this.chartCache);
        }
      }, error => {
        // Handled by HTTP interceptor: ErrorInterceptor
      });
  }

  /**
   * Because typescript does not let you check if an array contains a property in any other way.
   * Creates a new object and sets the label of a dataset.
   *
   * @param year the year for which we want to know if a property exists.
   */
  private chartYearExists(year: number): boolean {
    return this.chartData.some( (row) => {
      return row.label === year;
    });
  }

  /**
   * Generates a random color for the chart.
   */
  private getColor(index: number): string {
    // TODO we need these colors to have some opacity.
    const pastelColors = [
      '#98FB98', // PaleGreen
      '#AFEEEE', // PaleTurquoise
      '#F0E68C', // Khaki
      '#FFC0CB', // Pink
      '#FFA07A', // LightSalmon
      '#FFD700', // Gold
      '#87CEFA', // LightSkyBlue
      '#B0E0E6', // PowderBlue
      '#DDA0DD', // Plum
      '#E6E6FA', // Lavender
      '#F08080', // LightCoral
      '#E0FFFF', // LightCyan
      '#FAFAD2', // LightGoldenrodYellow
      '#D3D3D3', // LightGray
      '#FFF5EE', // Seashell
      '#FFE4E1', // MistyRose
      '#FDF5E6', // OldLace
      '#FFFACD', // LemonChiffon
      '#F5FFFA', // MintCream
    ];

    return pastelColors[index];
  }
}
