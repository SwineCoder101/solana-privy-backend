import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import WebSocketManager from './websocket-manager';

@Injectable()
export class BinancePriceService implements OnModuleInit {
  private readonly logger = new Logger(BinancePriceService.name);
  private priceSubjects: Map<string, Subject<any>> = new Map();

  onModuleInit() {
    this.logger.log('BinancePriceService initialized');
  }

  streamPrice(tokenPair: string): Observable<any> {
    const normalizedPair = tokenPair.toUpperCase();
    if (!this.priceSubjects.has(normalizedPair)) {
      const subject = new Subject<any>();
      this.priceSubjects.set(normalizedPair, subject);
      WebSocketManager.subscribe(normalizedPair, subject);
    }
    return this.priceSubjects.get(normalizedPair).asObservable();
  }

  closePriceStream(tokenPair: string): void {
    const normalizedPair = tokenPair.toUpperCase();
    if (this.priceSubjects.has(normalizedPair)) {
      WebSocketManager.unsubscribe(normalizedPair);
      this.priceSubjects.get(normalizedPair).complete();
      this.priceSubjects.delete(normalizedPair);
    }
  }

  onModuleDestroy() {
    this.priceSubjects.forEach((_, tokenPair) =>
      this.closePriceStream(tokenPair),
    );
  }
}
