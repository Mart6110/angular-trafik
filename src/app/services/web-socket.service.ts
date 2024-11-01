// web-socket.service.ts
import { Injectable } from '@angular/core';
import { ChartDataService } from './chart-data.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;

  constructor(private chartDataService: ChartDataService) {
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onmessage = data => {
      this.chartDataService.updateChartData(JSON.parse(data.data));
    };
  }
}