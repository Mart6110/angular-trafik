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
  // Input properties to receive chart type, title, data, and color from parent component
  @Input() chartType: 'line' | 'bar' | 'scatter' | 'pie' = 'line';
  @Input() title: string = '';
  @Input() data: { x: string[]; y: number[] } = { x: [], y: [] };
  @Input() color: string = 'blue'; // Ensure this line is present

  // ECharts option object to configure the chart
  chartOption: EChartsOption = {};
  
  // ViewChild to access the NgxEchartsDirective instance
  @ViewChild(NgxEchartsDirective, { static: false })
  chart!: NgxEchartsDirective;

  // Subscription to manage the chart data observable
  private chartDataSubscription!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private chartDataService: ChartDataService
  ) {}

  // Lifecycle hook that runs once the component is initialized
  ngOnInit(): void {
    this.updateChart();
    this.chartDataSubscription = this.chartDataService.chartData$.subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.data = this.transformData(data);
        }
        this.updateChart();
      }
    );
  }

  // Lifecycle hook that runs when input properties change
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['color']) { // Add color change detection
      this.updateChart();
    }
  }

  // Method to update the chart options and trigger change detection
  updateChart(): void {
    this.chartOption = {
      title: { text: this.title },
      tooltip: {
        trigger: this.chartType != 'bar' ? 'item' : 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: this.chartType !== 'pie' ? { 
        type: 'category', 
        data: this.data.x,
        boundaryGap: this.chartType === 'line' ? false : true // Ensure data points start at the y-axis for line charts
      } : undefined,
      yAxis: this.chartType !== 'pie' ? { type: 'value' } : undefined,
      series: [
        {
          type: this.chartType,
          data: this.chartType === 'pie' ? this.data.x.map((name, index) => ({ name, value: this.data.y[index] })) : this.data.y,
          itemStyle: { color: this.color } // Add color to series
        },
      ],
    };

    this.cdr.detectChanges();
  }

  // Lifecycle hook that runs when the component is destroyed
  ngOnDestroy(): void {
    if (this.chartDataSubscription) {
      this.chartDataSubscription.unsubscribe();
    }
  }

  // Method to transform the data into the format required by the chart
  private transformData(data: ChartData[]): { x: string[]; y: number[] } {
    const x = data.map(item => item.time);
    const y = data.map(item => item.value);
    return { x, y };
  }
}