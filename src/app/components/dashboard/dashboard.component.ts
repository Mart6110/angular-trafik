import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from "../chart/chart.component";
import { WebSocketService } from "../../services/web-socket.service";

// Define the available chart types
type ChartType = 'line' | 'bar' | 'scatter' | 'pie';

// Interface defining the structure of the chart configuration
interface ChartConfig {
  type: ChartType;                      // Type of chart (e.g., 'line', 'bar', etc.)
  title: string;                        // Title of the chart
  data: { x: string[]; y: number[] };   // Data for the chart with x (categories) and y (values)
}

// Component decorator to define the metadata for the DashboardComponent
@Component({
  selector: 'app-dashboard',                       // The CSS selector for this component in HTML
  standalone: true,                                // Marks this component as standalone
  imports: [CommonModule, ChartComponent],         // Declares imported modules/components for use in this component
  templateUrl: './dashboard.component.html',       // Specifies the HTML template file for the component
  styleUrls: ['./dashboard.component.scss']        // Specifies the stylesheet for the component
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  // Predefined configurations for different charts in the dashboard
  chartsConfig: ChartConfig[] = [
    { type: 'line', title: 'Line Chart', data: { x: ['1','2','3','4','5','6','7','8','9'], y: [1,2,3,4,5,6,7,8,9] } },
    { type: 'bar', title: 'Bar Chart', data: { x: ['1','2','3','4','5','6','7','8','9'], y: [1,2,3,4,5,6,7,8,9] } },
  ];

  private simulationInterval: any;

  // Injecting the WebSocketService and ChangeDetectorRef to listen for real-time data updates and trigger change detection
  constructor(private wsService: WebSocketService, private cdr: ChangeDetectorRef) {}

  // Lifecycle hook that runs after the component is initialized
  ngOnInit(): void {
    // Set up WebSocket listener to receive and process data
    this.wsService.listen((data) => {
      this.updateChartData(data);       // Update the chart data with each new data point received
    });
  }

  // Lifecycle hook that runs after the component's view has been fully initialized
  ngAfterViewInit(): void {
    // Start data simulation if no WebSocket data is received
    this.startDataSimulation();
  }

  // Lifecycle hook that runs when the component is destroyed
  ngOnDestroy(): void {
    // Clear the simulation interval when the component is destroyed
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
  }

  // Method to update chart data with real-time values from WebSocket
  updateChartData(data: any) {
    this.chartsConfig.forEach((chartConfig) => {
      chartConfig.data.x.push(data.time.toString());   // Add new timestamp to x-axis data
      chartConfig.data.y.push(data.value);             // Add new value to y-axis data

      // Keep only the last 10 data points
      if (chartConfig.data.x.length > 10) {
        chartConfig.data.x.shift();
        chartConfig.data.y.shift();
      }
      
    });

    //console.log('Updated chart data:', this.chartsConfig);
    this.cdr.detectChanges();  // Trigger change detection to update the view
  }

  // Method to start data simulation
  startDataSimulation() {
    this.simulationInterval = setInterval(() => {
      const simulatedData = {
        time: new Date().toLocaleTimeString(),
        value: Math.floor(Math.random() * 100) // Simulate a random value
      };
      this.updateChartData(simulatedData);
    }, 5000); // Generate data every 5 seconds
  }
}