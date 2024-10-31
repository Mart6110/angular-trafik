// Importing Angular's Injectable decorator for dependency injection
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'    // Provides this service at the root level, making it a singleton across the app
})
export class WebSocketService {
  private socket: WebSocket;  // WebSocket instance for managing a connection

  constructor() {
    // Establishing a WebSocket connection to the specified URL upon service instantiation
    this.socket = new WebSocket('ws://localhost:8080');
  }

  // Method to listen for incoming messages from the WebSocket server
  // Accepts a callback function that processes incoming data
  listen(callback: (data: any) => void) {
    // When a message is received, it parses the data and invokes the callback
    this.socket.onmessage = data => {
      callback(JSON.parse(data.data));  // Parse JSON data before passing to callback
    };
  }
}
