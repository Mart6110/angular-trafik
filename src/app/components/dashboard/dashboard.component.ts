import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../chart/chart.component';
import { WebSocketService } from '../../services/web-socket.service';
import { ChartDataService, ChartData, BatchData } from '../../services/chart-data.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'; 
import { MatTableDataSource } from '@angular/material/table';

// Define possible chart types for configuration flexibility
type ChartType = 'line' | 'bar' | 'scatter' | 'pie';

// Interface for chart configuration details
interface ChartConfig {
  type: ChartType;
  title: string;
  data: { x: string[]; y: number[] };
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ChartComponent,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  // Configuration for different types of charts in the dashboard
  chartsConfig: ChartConfig[] = [
    {
      type: 'line',
      title: 'Summer Dress Data',
      data: { x: [], y: [] },
      color: '#11f0e3',
    },
    {
      type: 'bar',
      title: 'Car Crash Data',
      data: { x: [], y: [] },
      color: '#FF5A5F',
    },
    {
      type: 'pie',
      title: 'Batch Data',
      data: { x: [], y: [] },
      color: '#FFB6C1',
    },
  ];

  // Variables to manage the simulation interval and chart data subscription -- Not used
  private simulationInterval: any;

  // Subscription management for WebSocket data streams
  private chartDataSubscription!: Subscription;
  private batchDataSubscription!: Subscription;
  
  private dataCounter = 0;

  // Manage a data source for table display
  dataPointLimit: number = 10;
  displayedColumns: string[] = ['time', 'value', 'title'];
  dataSource = new MatTableDataSource<ChartData>();

  constructor(
    private wsService: WebSocketService,
    private chartDataService: ChartDataService,
    private cdr: ChangeDetectorRef
  ) {}

  // Initialize component; subscriptions are set up in AfterViewInit
  ngOnInit(): void {}

  // Subscribes to WebSocket data after component view initialization
  ngAfterViewInit(): void {
    this.chartDataSubscription = this.chartDataService.chartData$.subscribe((data) => {
      this.updateChartData(data);
    });

    this.batchDataSubscription = this.chartDataService.batchData$.subscribe((batchData) => {
      this.updatePieChartData(batchData);
    });
  }

  // Cleanup to prevent memory leaks by unsubscribing on component destruction
  ngOnDestroy(): void {
    this.chartDataSubscription.unsubscribe();
    this.batchDataSubscription.unsubscribe();
  }

  // Updates the limit on data points shown in each chart and refreshes view
  applyDataLimit() {
    this.chartsConfig.forEach((chartConfig) => {
      this.trimChartData(chartConfig);
    });
    this.cdr.detectChanges();
  }

  // Updates the line or bar chart with incoming data and manages data limit
  updateChartData(data: ChartData) {
    const chartIndex = this.chartsConfig.findIndex(chart => chart.title === data.title);
    if (chartIndex !== -1) {
      const chartConfig = this.chartsConfig[chartIndex];
      chartConfig.data.x.push(data.time);
      chartConfig.data.y.push(data.value);
      this.trimChartData(chartConfig);

      // Update the data table displayed in the component
      this.dataSource.data = [data, ...this.dataSource.data];
      this.cdr.detectChanges();
    }
  }

  // Updates the pie chart with batch data
  updatePieChartData(batchData: BatchData[]) {
    const pieChart = this.chartsConfig.find((chart) => chart.title === 'Batch Data');
    if (pieChart) {
      pieChart.data.x = batchData.map((item) => item.name);
      pieChart.data.y = batchData.map((item) => item.value);
      this.cdr.detectChanges();
    }
  }

  // Starts simulating data for the charts at regular intervals -- Not used -- Was used for testing
  startDataSimulation() {
    this.simulationInterval = setInterval(() => {
      const simulatedData: ChartData = {
        time: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 100),
        title: this.chartsConfig[this.dataCounter % 2].title,
      };
      this.chartDataService.updateChartData(simulatedData);
    }, 1000);
  }

  // Changes the chart type for a given chart configuration
  changeChartType(chartConfig: ChartConfig, event: MatSelectChange) {
    const newType = event.value as ChartType;
    chartConfig.type = newType;
    this.cdr.detectChanges();
  }

  // Changes the color of a specific chart based on user selection
  changeChartColor(chartConfig: ChartConfig, event: MatSelectChange) {
    const newColor = event.value;
    chartConfig.color = newColor;
    this.cdr.detectChanges();
  }

  // Trims chart data arrays to adhere to the configured limit
  private trimChartData(chartConfig: any) {
    const limit = 10;
    while (chartConfig.data.x.length > limit) {
      chartConfig.data.x.shift();
      chartConfig.data.y.shift();
    }
  }
}