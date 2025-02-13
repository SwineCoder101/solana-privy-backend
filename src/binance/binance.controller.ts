import { Controller, Get, Query } from '@nestjs/common';
import { BinanceClientService } from './binance-client.service';

@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceClientService: BinanceClientService) {}

  // @Get('prices')
  // getPriceStream(@Query('tokenPair') tokenPair: string): Observable<any> {
  //   // Example tokenPair: btcusdt, ethusdt, etc.
  //   return this.binancePriceService.streamPrice(tokenPair);
  // }

  @Get('price-range')
  async getPriceRange(
    @Query('symbol') symbol: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    // Convert query params to numbers.
    const start = parseInt(startTime, 10);
    const end = parseInt(endTime, 10);

    const result = await this.binanceClientService.fetchPriceRange(
      symbol,
      start,
      end,
    );
    return result;
  }
}
