// chart-data.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  private chartDataSubject = new Subject<any>();
  chartData$ = this.chartDataSubject.asObservable();

  updateChartData(data: any) {
    this.chartDataSubject.next(data);
  }
}