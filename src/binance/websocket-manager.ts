import WebSocket from 'ws';
import { Subject } from 'rxjs';
import { Logger } from '@nestjs/common';

class WebSocketManager {
  private static instance: WebSocket;
  private static subscribedStreams = new Set<string>();
  private static subjects: Map<string, Subject<any>> = new Map();
  private static reconnectAttempts = 0;
  private static maxReconnectAttempts = 5;
  private static reconnectInterval = 5000;
  private static logger = new Logger('WebSocketManager');
  private static pingInterval: NodeJS.Timeout;

  static getConnection(): WebSocket {
    if (!this.instance) {
      this.initializeConnection();
    }
    return this.instance;
  }

  private static initializeConnection() {
    this.instance = new WebSocket('wss://stream.binance.com:9443/stream');
    this.setupEventHandlers();
  }

  private static setupEventHandlers() {
    if (!this.instance) return;

    // Ping every 30s to keep connection alive
    this.pingInterval = setInterval(() => {
      if (this.instance.readyState === WebSocket.OPEN) {
        this.instance.ping();
      }
    }, 30000);

    this.instance.on('open', () => {
      this.logger.log('WebSocket connection opened');
      this.reconnectAttempts = 0;
      this.resubscribe();
    });

    this.instance.on('message', (data: string) => {
      try {
        const { stream, data: streamData } = JSON.parse(data);
        const symbol = stream.split('@')[0].toUpperCase();
        const subject = this.subjects.get(symbol);
        if (subject) {
          subject.next(streamData);
        } else {
          this.logger.debug(`No subject for symbol ${symbol}`);
        }
      } catch (error) {
        this.logger.error(`Error parsing message: ${error.message}`);
      }
    });

    this.instance.on('error', (error) => {
      this.logger.error(`WebSocket error: ${error.message}`);
    });

    this.instance.on('close', (code, reason) => {
      this.logger.error(`WebSocket closed: ${code} ${reason}`);
      clearInterval(this.pingInterval);
      this.handleReconnect();
    });
  }

  private static resubscribe() {
    if (
      this.subscribedStreams.size > 0 &&
      this.instance.readyState === WebSocket.OPEN
    ) {
      const payload = {
        method: 'SUBSCRIBE',
        params: Array.from(this.subscribedStreams),
        id: 1,
      };
      this.instance.send(JSON.stringify(payload));
    }
  }

  private static handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.initializeConnection();
      }, this.reconnectInterval);
    } else {
      this.logger.error('Max reconnect attempts reached');
      this.subjects.forEach((subject) => subject.error('Connection failed'));
    }
  }

  static subscribe(tokenPair: string, subject: Subject<any>): void {
    // Ensure that a connection is established
    if (!this.instance || this.instance.readyState !== WebSocket.OPEN) {
      if (!this.instance) {
        this.initializeConnection();
      }
    }
    const stream = `${tokenPair.toLowerCase()}@kline_1m`;
    this.subscribedStreams.add(stream);
    this.subjects.set(tokenPair, subject);

    // If the connection is already open, send the subscription immediately.
    if (this.instance?.readyState === WebSocket.OPEN) {
      this.resubscribe();
    }
  }

  static unsubscribe(tokenPair: string): void {
    const stream = `${tokenPair.toLowerCase()}@kline_1m`;
    this.subscribedStreams.delete(stream);
    this.subjects.delete(tokenPair);

    if (this.instance?.readyState === WebSocket.OPEN) {
      const payload = {
        method: 'UNSUBSCRIBE',
        params: [stream],
        id: 1,
      };
      this.instance.send(JSON.stringify(payload));
    }
  }

  static closeConnection() {
    if (this.instance) {
      this.instance.close();
      this.instance = null;
      this.subscribedStreams.clear();
      this.subjects.clear();
      clearInterval(this.pingInterval);
    }
  }
}

export default WebSocketManager;
