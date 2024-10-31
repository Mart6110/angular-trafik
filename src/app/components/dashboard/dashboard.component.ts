import { Component, OnInit } from '@angular/core';
import { ChartComponent } from "../chart/chart.component";
import { WebSocketService } from "../../services/web-socket.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  chartsConfig = [
    { type: 'line', title: 'Line Chart', data: { x: [] as number[], y: [] as number[] } },
    { type: 'bar', title: 'Bar Chart', data: { x: [] as number[], y: [] as number[] } },
  ];

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsService.listen((data) => {
      this.updateChartData(data);
    });
  }

  updateChartData(data: any) {
    this.chartsConfig.forEach((chartConfig) => {
      chartConfig.data.x.push(data.time);
      chartConfig.data.y.push(data.value);
    });
  }
}
