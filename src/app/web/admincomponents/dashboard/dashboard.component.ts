import { Component, OnInit } from '@angular/core';
import {ChartType} from 'chart.js';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40, 25, 45, 80, 98, 120], label: '2021'},
    {data: [28, 48, 40, 19, 86, 27, 90, 30, 55, 60, 40, 160], label: '2022'}
  ];

  constructor() { }

  ngOnInit() {

  }

}
