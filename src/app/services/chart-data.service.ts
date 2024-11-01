// chart-data.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ChartData {
  time: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  private chartDataSubject = new Subject<ChartData>();
  chartData$ = this.chartDataSubject.asObservable();

  updateChartData(data: ChartData) {
    this.chartDataSubject.next(data);
  }
}