import { Component, OnInit } from '@angular/core';
import {ChartType} from 'chart.js';

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
  public chartData = [
    {data: [65, 59, 80, 81, 56, 55, 40, 25, 45, 80, 98, 120], label: '2021'},
    {data: [28, 48, 40, 19, 86, 27, 90, 30, 55, 60, 40, 160], label: '2022'}
  ];

  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';

  /*
  TODO:
   - Create a serv to fetch chart data
   - Create API endpoint to get data from db
   - Add loading spinners
   - Check for 0/null values?
   */


  constructor() { }

  ngOnInit() {

  }

}
