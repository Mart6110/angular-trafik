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
import { ChartDataService, ChartData } from '../../services/chart-data.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

// Define the possible chart types
type ChartType = 'line' | 'bar' | 'scatter' | 'pie';

// Interface for chart configuration
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  // Array to hold the configuration for each chart
  chartsConfig: ChartConfig[] = [
    {
      type: 'line',
      title: 'Line Chart',
      data: { x: [], y: [] },
      color: '#11f0e3',
    },
    {
      type: 'bar',
      title: 'Bar Chart',
      data: { x: [], y: [] },
      color: '#FF5A5F',
    },
    {
      type: 'line',
      title: 'Line Chart',
      data: { x: [], y: [] },
      color: '#FC642D',
    },
    {
      type: 'bar',
      title: 'Bar Chart',
      data: { x: [], y: [] },
      color: '#767676',
    },
  ];

  // Variables to manage the simulation interval and chart data subscription
  private simulationInterval: any;
  private chartDataSubscription!: Subscription;
  private dataCounter = 0;

  dataPointLimit: number = 10;

  constructor(
    private wsService: WebSocketService,
    private chartDataService: ChartDataService,
    private cdr: ChangeDetectorRef
  ) {}

  // Lifecycle hook that runs once the component is initialized
  ngOnInit(): void {}

  // Lifecycle hook that runs after the component's view has been initialized
  ngAfterViewInit(): void {
    this.chartDataSubscription = this.chartDataService.chartData$.subscribe(
      (data) => {
        this.updateChartData(data);
      }
    );

    //this.startDataSimulation();
  }

  // Lifecycle hook that runs when the component is destroyed
  ngOnDestroy(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    if (this.chartDataSubscription) {
      this.chartDataSubscription.unsubscribe();
    }
  }

  // Method to apply the new data limit to each chart
  applyDataLimit() {
    this.chartsConfig.forEach((chartConfig) => {
      this.trimChartData(chartConfig);
    });
    this.cdr.detectChanges();
  }

  // Method to update the chart data
  updateChartData(data: ChartData) {
    const chartIndex = this.dataCounter % this.chartsConfig.length;
    const chartConfig = this.chartsConfig[chartIndex];

    chartConfig.data.x.push(data.time.toString());
    chartConfig.data.y.push(data.value);

    this.trimChartData(chartConfig);
    this.dataCounter++;
    this.cdr.detectChanges();
  }

  // Method to start the data simulation
  startDataSimulation() {
    this.simulationInterval = setInterval(() => {
      const simulatedData: ChartData = {
        time: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 100),
      };
      this.chartDataService.updateChartData(simulatedData);
    }, 1000);
  }

  changeChartType(chartConfig: ChartConfig, event: MatSelectChange) {
    const newType = event.value as ChartType;
    chartConfig.type = newType;
    this.cdr.detectChanges();
  }

  changeChartColor(chartConfig: ChartConfig, event: MatSelectChange) {
    const newColor = event.value;
    chartConfig.color = newColor;
    this.cdr.detectChanges();
  }

  // Helper function to trim data arrays based on dataPointLimit
  private trimChartData(chartConfig: ChartConfig) {
    while (chartConfig.data.x.length > this.dataPointLimit) {
      chartConfig.data.x.shift();
      chartConfig.data.y.shift();
    }
  }
}
