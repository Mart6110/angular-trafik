import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket('ws://localhost:8080');
  }

  listen(callback: (data: any) => void) {
    this.socket.onmessage = data => {
      callback(JSON.parse(data.data));
    };
  }
}
