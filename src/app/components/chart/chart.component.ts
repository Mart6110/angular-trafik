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
import { ChartDataService } from '../../services/chart-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() chartType: 'line' | 'bar' | 'scatter' | 'pie' = 'line';
  @Input() title: string = '';
  @Input() data: { x: string[]; y: number[] } = { x: [], y: [] };

  chartOption: EChartsOption = {};
  @ViewChild(NgxEchartsDirective, { static: false })
  chart!: NgxEchartsDirective;

  private chartDataSubscription!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private chartDataService: ChartDataService
  ) {}

  ngOnInit(): void {
    this.updateChart();
    this.chartDataSubscription = this.chartDataService.chartData$.subscribe(
      (data) => {
        console.log('Data received');
        console.log(data);
        if (Array.isArray(data)) {
          this.data = this.transformData(data);
        } else {
          console.error('Data format is incorrect:', data);
        }
        this.updateChart();
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Data changed:', changes['data'].currentValue);
      this.updateChart();
    }
  }

  updateChart(): void {
    console.log('Updating chart with data:', this.data);
    this.chartOption = {
      title: { text: this.title },
      xAxis: { type: 'category', data: this.data.x },
      yAxis: { type: 'value' },
      series: [
        {
          type: this.chartType,
          data: this.data.y,
        },
      ],
    };

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.chartDataSubscription) {
      this.chartDataSubscription.unsubscribe();
    }
  }

  private transformData(data: { time: string; value: number }[]): { x: string[]; y: number[] } {
    const x = data.map(item => item.time);
    const y = data.map(item => item.value);
    return { x, y };
  }
}