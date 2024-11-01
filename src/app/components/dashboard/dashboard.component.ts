import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from "../chart/chart.component";
import { WebSocketService } from "../../services/web-socket.service";
import { ChartDataService } from '../../services/chart-data.service';
import { Subscription } from 'rxjs';
import {MatCardModule} from '@angular/material/card';

type ChartType = 'line' | 'bar' | 'scatter' | 'pie';

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
  chartsConfig: ChartConfig[] = [
    { type: 'line', title: 'Line Chart', data: { x: [], y: [] } },
    { type: 'bar', title: 'Bar Chart', data: { x: [], y: [] } },
    { type: 'line', title: 'Line Chart', data: { x: [], y: [] } },
    { type: 'pie', title: 'Pie Chart', data: { x: [], y: [] } },
  ];

  private simulationInterval: any;
  private chartDataSubscription!: Subscription;
  private dataCounter = 0;

  constructor(private wsService: WebSocketService, private chartDataService: ChartDataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chartDataSubscription = this.chartDataService.chartData$.subscribe(data => {
      this.updateChartData(data);
    });
  }

  ngAfterViewInit(): void {
    this.startDataSimulation();
  }

  ngOnDestroy(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
    if (this.chartDataSubscription) {
      this.chartDataSubscription.unsubscribe();
    }
  }

  updateChartData(data: any) {
    // Distribute data to different charts based on dataCounter
    const chartIndex = this.dataCounter % this.chartsConfig.length;
    const chartConfig = this.chartsConfig[chartIndex];

    chartConfig.data.x.push(data.time.toString());
    chartConfig.data.y.push(data.value);

    if (chartConfig.data.x.length > 10) {
      chartConfig.data.x.shift();
      chartConfig.data.y.shift();
    }

    this.dataCounter++;
    this.cdr.detectChanges();
  }

  startDataSimulation() {
    this.simulationInterval = setInterval(() => {
      const simulatedData = {
        time: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 100)
      };
      this.chartDataService.updateChartData(simulatedData);
    }, 1000);
  }
}