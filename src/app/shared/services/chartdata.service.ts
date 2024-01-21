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

        // The foreach counter counts to much in this setup.
        let colorCounter = 0;
        const black = 'rgb(0,0,0)';

        cache.forEach((row: any) => {
          if (this.chartData.length > 0 && this.chartYearExists(row.year)) {
            this.chartData.forEach((chartDataObj) => {
              if (chartDataObj.label === row.year) {
                const index = row.month - 1;
                chartDataObj.data[index] = row.hours;
              }
            });
          } else {
            const color = this.getColor(colorCounter);
            const hoverColor = this.getColor(colorCounter, true);

            // Chart config for each year
            const chartObj = {
              label: row.year,
              backgroundColor: color,
              borderColor: black,
              borderWidth: 1,
              hoverBackgroundColor: hoverColor,
              hoverBorderColor: black,
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            };

            // Set the data in the data property of the chartObj
            const index = row.month - 1;
            chartObj.data[index] = row.hours;
            this.chartData.push(chartObj);

            colorCounter++;
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
    if (year || locationId) {
      this.fetchChartData(year, locationId);
    } else {
      this.fetchChartData();
    }
  }

  /**
   * Sends the request to fetch the chartData from the server.
   * This method accepts optional params. When both year and locationId are set data will be
   * fetched for the current location and year. If one of the params is set data for that param will be fetched.
   */
  private fetchChartData(year?: number, locationId?: number): Subscription {
    // Create the httpString depending on the given params.
    let httpString = '/chart/get';
    if (year && locationId) {
      httpString = '/chart/get?year=' + year + '&locationId=' + locationId;
    } else if (year && !locationId) {
      httpString = '/chart/get?year=' + year;
    } else if (!year && locationId) {
      httpString = '/chart/get?locationId=' + locationId;
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
   * Get's a color from the
   */
  private getColor(index: number, hoverColor?: boolean): string {
    // Change the opacity for the hover color.
    let opacity = 0.5;
    if (hoverColor) {
      opacity = 1;
    }

    // Array with our chart colors with opacity.
    const pastelColors = [
      'rgba(152, 251, 152, ' + opacity + ')', // PaleGreen
      'rgba(135, 206, 250,' + opacity + ')', // Skyblue
      'rgba(255, 215, 0,' + opacity + ')', // Gold
      'rgba(255, 228, 196,' + opacity + ')', // Bisque
      'rgba(255, 99, 71,' + opacity + ')', // Tomato
      'rgba(245, 245, 220,' + opacity + ')', // Beige
    ];

    // When the given index exceeds the color array limit, we want to set the index to 0 again and keep going from there.
    if (index > (pastelColors.length - 1)) {
      const newIndex = (index % pastelColors.length) - 1;
      return pastelColors[newIndex];
    }

    return pastelColors[index];
  }
}
