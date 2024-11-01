import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from "../chart/chart.component";
import { WebSocketService } from "../../services/web-socket.service";
import { ChartDataService, ChartData } from '../../services/chart-data.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

// Define the possible chart types
type ChartType = 'line' | 'bar' | 'scatter' | 'pie';

// Interface for chart configuration
interface ChartConfig {
  type: ChartType;
  title: string;
  data: { x: string[]; y: number[] };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartComponent, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  // Array to hold the configuration for each chart
  chartsConfig: ChartConfig[] = [
    { type: 'line', title: 'Line Chart', data: { x: [], y: [] } },
    { type: 'bar', title: 'Bar Chart', data: { x: [], y: [] } },
    { type: 'line', title: 'Line Chart', data: { x: [], y: [] } },
    { type: 'bar', title: 'Bar Chart', data: { x: [], y: [] } },
  ];

  // Variables to manage the simulation interval and chart data subscription
  private simulationInterval: any;
  private chartDataSubscription!: Subscription;
  private dataCounter = 0;

  constructor(private wsService: WebSocketService, private chartDataService: ChartDataService, private cdr: ChangeDetectorRef) {}

  // Lifecycle hook that runs once the component is initialized
  ngOnInit(): void {
    this.chartDataSubscription = this.chartDataService.chartData$.subscribe(data => {
      this.updateChartData(data);
    });
  }

  // Lifecycle hook that runs after the component's view has been initialized
  ngAfterViewInit(): void {
    this.startDataSimulation();
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

  // Method to update the chart data
  updateChartData(data: ChartData) {
    // Distribute data to different charts based on dataCounter
    const chartIndex = this.dataCounter % this.chartsConfig.length;
    const chartConfig = this.chartsConfig[chartIndex];

    chartConfig.data.x.push(data.time.toString());
    chartConfig.data.y.push(data.value);

    // Limit the data points to the last 10 entries
    if (chartConfig.data.x.length > 10) {
      chartConfig.data.x.shift();
      chartConfig.data.y.shift();
    }

    this.dataCounter++;
    this.cdr.detectChanges();
  }

  // Method to start the data simulation
  startDataSimulation() {
    this.simulationInterval = setInterval(() => {
      const simulatedData: ChartData = {
        time: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 100)
      };
      this.chartDataService.updateChartData(simulatedData);
    }, 1000);
  }
}