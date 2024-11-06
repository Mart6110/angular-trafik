import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule, NgxEchartsDirective } from 'ngx-echarts';
import { ChartDataService, ChartData } from '../../services/chart-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnChanges {
  // Inputs for configuring the chart's type, title, data, and color
  @Input() chartType: 'line' | 'bar' | 'scatter' | 'pie' = 'line';
  @Input() title: string = '';
  @Input() data: { x: string[]; y: number[] } = { x: [], y: [] };
  @Input() color: string = '#11f0e3';

  // Configuration for ECharts, populated in updateChart()
  chartOption: EChartsOption = {};

  // Predefined colors for pie chart segments
  private pieChartColors = ['#11f0e3', '#FF5A5F', '#FC642D', '#767676', '#FFB6C1'];

  // Reference to the chart instance
  @ViewChild(NgxEchartsDirective, { static: false })
  chart!: NgxEchartsDirective;

  // Subscription for chart data updates from ChartDataService
  private chartDataSubscription!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private chartDataService: ChartDataService
  ) {}

  // Initialization to set up the chart and data subscription
  ngOnInit(): void {
    this.updateChart(); // Set initial chart configuration
    this.chartDataSubscription = this.chartDataService.chartData$.subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.data = this.transformData(data); // Format data if received as an array
        }
        this.updateChart(); // Refresh chart with new data
      }
    );
  }

  // Update chart when input properties change (e.g., new data or color)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['color']) {
      // Add color change detection
      this.updateChart();
    }
  }

  // Method to configure chart options based on inputs and type
  updateChart(): void {
    this.chartOption = {
      title: { text: this.title },
      tooltip: {
        formatter: '{b}: {c}',
        trigger: this.chartType !== 'bar' ? 'item' : 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis:
        this.chartType !== 'pie'
          ? {
              type: 'category',
              data: this.data.x,
              boundaryGap: this.chartType === 'line' ? false : true,
            }
          : undefined,
      yAxis: this.chartType !== 'pie' ? { type: 'value' } : undefined,
      series: [
        {
          type: this.chartType,
          data:
            this.chartType === 'pie'
              ? this.data.x.map((name, index) => ({
                  name,
                  value: this.data.y[index],
                }))
              : this.data.y,
          itemStyle: { 
            color: this.chartType === 'pie' ? undefined : this.color 
          },
          color: this.chartType === 'pie' ? this.pieChartColors : [this.color],
          markLine:
            this.chartType !== 'pie'
              ? {
                  animation: false,
                  data: [
                    { type: 'max', name: 'Max' },
                    { type: 'average', name: 'avg' },
                    { type: 'min', name: 'Min' },
                  ],
                  label: {
                    show: true,
                    formatter: '{b}: {c}',
                    color: '#fff',
                  },
                }
              : undefined,
        },
      ],
    };
  
    this.cdr.detectChanges();
  }

  // Cleanup by unsubscribing from observables when component is destroyed
  ngOnDestroy(): void {
    if (this.chartDataSubscription) {
      this.chartDataSubscription.unsubscribe();
    }
  }

  // Transforms raw data array into an object with x and y arrays for the chart
  private transformData(data: ChartData[]): { x: string[]; y: number[] } {
    const x = data.map((item) => item.time);
    const y = data.map((item) => item.value);
    return { x, y };
  }
}
