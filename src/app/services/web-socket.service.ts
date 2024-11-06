import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartDataService, ChartData } from './chart-data.service';
import mqtt from 'mqtt';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client!: mqtt.MqttClient; // MQTT client instance for message handling

  constructor(
    private chartDataService: ChartDataService,
    @Inject(PLATFORM_ID) private platformId: Object // Detects the current platform (browser/server)
  ) {
    // Only initialize the MQTT client if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.initMqttClient();
    }
  }

  private initMqttClient() {
    // Connects to the MQTT broker on the specified address
    this.client = mqtt.connect('mqtt://10.14.2.64:8080');

    // Establishes a connection with the broker and subscribes to topics
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.subscribeToTopic('summerdress');
      this.subscribeToTopic('carcrash');
      this.subscribeToTopic('batch');
    });
  }

  private subscribeToTopic(topic: string) {
    // Subscribes to a specific topic and logs any errors
    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Subscription error for topic ${topic}:`, err);
      } else {
        console.log(`Subscribed to topic: ${topic}`);
      }
    });
  
    // Handles incoming messages on the subscribed topic
    this.client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        // Parse the message payload and convert to JSON
        console.log(`Received message on topic ${topic}:`, message.toString());
        const receivedData = JSON.parse(message.toString());

        if (topic === 'batch') {
          // Format batch data for pie chart as an array of objects with name/value pairs
          const batchData = Object.keys(receivedData).map((key) => ({
            name: key,
            value: receivedData[key],
          }));
          
          // Send formatted batch data to be displayed on the chart
          this.chartDataService.updateBatchData(batchData);
        } else {
          // Define chart data based on the topic type
          let chartData: ChartData;

          if (topic === 'carcrash') {
            // Structure data specifically for car crash metrics
            chartData = {
              time: new Date(receivedData.timestamp * 1000).toLocaleTimeString(),
              value: receivedData.car_crashes,
              title: 'Car Crash Data'
            };
          } else if (topic === 'summerdress') {
            // Structure data specifically for summer dress metrics
            chartData = {
              time: new Date(receivedData.timestamp * 1000).toLocaleTimeString(),
              value: receivedData.sundresses,
              title: 'Summer Dress Data'
            };
          } else {
            // Default structure for data with unrecognized topic
            chartData = {
              time: new Date(receivedData.timestamp * 1000).toLocaleTimeString(),
              value: receivedData.value,
              title: 'Data Unknown'
            };
          }

          // Updates chart data service with the new data for display
          this.chartDataService.updateChartData(chartData);
        }
      }
    });
  }
}
