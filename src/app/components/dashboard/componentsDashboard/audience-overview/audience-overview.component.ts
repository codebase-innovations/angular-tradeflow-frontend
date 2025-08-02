import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
import { NgApexchartsModule } from 'ng-apexcharts';
import { MonthlySales, WeeklySales } from "../../dashboard.service"; 
import {

    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexGrid,
    ApexXAxis,
    ApexFill,
    ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    grid: ApexGrid;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    colors: any;
};

@Component({
    selector: 'app-audience-overview',
    standalone: true,
    templateUrl: './audience-overview.component.html',
    styleUrls: ['./audience-overview.component.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatMenuModule,
        NgApexchartsModule
      ],
})
export class AudienceOverviewComponent implements OnChanges {
  @Input() weeklySalesData: WeeklySales[] = [];
  @Input() monthlySalesData: MonthlySales[] = [];

  chartOptions: any = {
    series: [],
    chart: {
      type: 'bar',
      height: 350
    },
    xaxis: {
      categories: []
    }
  };

 ngOnChanges() {
  this.setChartData(); 
}

setChartData() {
  const monthlyCategories = this.monthlySalesData.map(item => item.month);
  const monthlyData = this.monthlySalesData.map(item => item.totalSales);

  const weeklyCategories = this.weeklySalesData.map(item => item.weekRange);
  const weeklyData = this.weeklySalesData.map(item => item.totalSales);


  const categories = monthlyCategories.length >= weeklyCategories.length ? monthlyCategories : weeklyCategories;

  this.chartOptions = {
    ...this.chartOptions,
    xaxis: {
      categories
    },
    series: [
      {
        name: 'Monthly Sales',
        data: monthlyData
      },
      {
        name: 'Weekly Sales',
        data: weeklyData
      }
    ]
  };
}
}
