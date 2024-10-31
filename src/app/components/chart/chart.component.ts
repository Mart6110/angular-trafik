import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit {
  @Input() chartType: 'line' | 'bar' | 'scatter' | 'pie' = 'line';
  @Input() title: string = 'Chart';
  @Input() data: { x: string[]; y: number[] } = { x: [], y: [] };

  chartOption: EChartsOption = {};

  ngOnInit() : void {
    this.updateChart();
  }

  ngOnChanges() : void {
    this.updateChart();
  }

 updateChart() {
    this.chartOption = {
      title: { text: this.title },
      xAxis: { type: 'category', data: this.data.x },
      yAxis: { type: 'value' },
      series: [{
        type: this.chartType,
        data: this.data.y
      }]
    };
  }
}
