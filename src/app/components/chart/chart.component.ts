import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule, NgxEchartsDirective } from 'ngx-echarts';

// Define the app-chart component with necessary metadata
@Component({
  selector: 'app-chart',                        // The CSS selector for this component in HTML
  standalone: true,                             // Marks this component as standalone
  imports: [CommonModule, NgxEchartsModule],    // Declares imported modules/components for use in this component
  templateUrl: './chart.component.html',        // Specifies the HTML template file for the component
  styleUrls: ['./chart.component.scss']         // Specifies the stylesheet for the component
})
export class ChartComponent implements OnInit, OnChanges {
  // Input properties to receive chart configuration from parent components
  @Input() chartType: 'line' | 'bar' | 'scatter' | 'pie' = 'line';   // Default chart type is 'line'
  @Input() title: string = 'Chart';                                  // Default chart title
  @Input() data: { x: string[]; y: number[] } = { x: [], y: [] };    // Default chart data

  // Object holding the configuration options for the ECharts instance
  chartOption: EChartsOption = {};

  // Reference to the NgxEchartsDirective
  @ViewChild(NgxEchartsDirective, { static: false }) chart!: NgxEchartsDirective;

  constructor(private cdr: ChangeDetectorRef) {}

  // Lifecycle hook that runs after the component is initialized
  ngOnInit(): void {
    this.updateChart();   // Initialize chart with current input data and settings
  }

  // Lifecycle hook to detect changes in input properties and update the chart accordingly
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Chart data changed:', changes['data'].currentValue);
      console.log('Chart data previous:', changes['data'].previousValue);
      console.log('Chart data', this.data);
      this.updateChart();   // Update chart if any input data changes
    }
  }

  // Method to configure chart options based on input properties
  updateChart(): void {
    this.chartOption = {
      title: { text: this.title },               // Set the chart title
      xAxis: { type: 'category', data: this.data.x },  // Configure x-axis with categorical data
      yAxis: { type: 'value' },                  // Configure y-axis as numeric
      series: [{
        type: this.chartType,                    // Set the chart type (e.g., line, bar)
        data: this.data.y                        // Bind y-axis data for the chart
      }]
    };

    // Manually trigger the chart update
    this.cdr.detectChanges();
  }
}