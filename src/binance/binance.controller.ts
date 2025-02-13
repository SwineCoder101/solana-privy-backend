import { Controller, Get, Query } from '@nestjs/common';
import { BinancePriceService } from './binance-price.service';
import { Observable } from 'rxjs';

@Controller('binance')
export class BinanceController {
  constructor(private readonly binancePriceService: BinancePriceService) {}

  @Get('prices')
  getPriceStream(@Query('tokenPair') tokenPair: string): Observable<any> {
    // Example tokenPair: btcusdt, ethusdt, etc.
    return this.binancePriceService.streamPrice(tokenPair);
  }
}
