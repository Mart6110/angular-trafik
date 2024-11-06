import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Interface defining the structure of individual chart data points
export interface ChartData {
  time: string;
  value: number;
  title: string;
}

// Interface defining the structure for batch data (e.g., for pie charts)
export interface BatchData {
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})

export class ChartDataService {
  // Subject to handle real-time data streaming for individual data points
  private chartDataSubject = new Subject<ChartData>();
  chartData$ = this.chartDataSubject.asObservable(); // Observable for subscribing to chart data updates

  // Subject to handle batch data updates (e.g., pie chart data)
  private batchDataSubject = new Subject<BatchData[]>();
  batchData$ = this.batchDataSubject.asObservable(); // Observable for subscribing to batch data updates

  // Publishes new data for individual chart updates
  updateChartData(data: ChartData) {
    this.chartDataSubject.next(data);
  }

  // Publishes new batch data for grouped chart updates
  updateBatchData(batchData: BatchData[]) {
    this.batchDataSubject.next(batchData);
  }
}