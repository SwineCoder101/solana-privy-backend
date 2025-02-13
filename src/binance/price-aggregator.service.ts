import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BinancePriceService } from './binance-price.service';

interface PriceRecord {
  lowest: number;
  highest: number;
}

@Injectable()
export class PriceAggregatorService implements OnModuleInit {
  private readonly logger = new Logger(PriceAggregatorService.name);
  private aggregatedPrices: Record<string, PriceRecord> = {};

  constructor(private readonly binancePriceService: BinancePriceService) {}

  onModuleInit() {
    this.logger.log('Initializing Price Aggregator Service...');
    // Subscribe individually to each token's price stream.
    this.subscribeToPriceStream('BTCUSDT');
    this.subscribeToPriceStream('ETHUSDT');
    this.subscribeToPriceStream('SOLUSDT');
  }

  /**
   * Subscribes to the price stream for the given token pair and updates
   * the stored lowest and highest price for that token pair.
   */
  private subscribeToPriceStream(tokenPair: string): void {
    const stream$ = this.binancePriceService.streamPrice(tokenPair);
    stream$.subscribe({
      next: (data: any) => {
        const price = this.extractClosingPrice(data, tokenPair);
        if (isNaN(price)) return;

        // If this is the first price, initialize the record.
        if (!this.aggregatedPrices[tokenPair]) {
          this.aggregatedPrices[tokenPair] = { lowest: price, highest: price };
          this.logger.log(
            `Initialized ${tokenPair} prices: Current Price: ${price}, Lowest: ${price}, Highest: ${price}`,
          );
        } else {
          const record = this.aggregatedPrices[tokenPair];
          if (price < record.lowest) {
            record.lowest = price;
          }
          if (price > record.highest) {
            record.highest = price;
          }
          this.logger.log(
            `Updated ${tokenPair} prices: Current Price: ${price}, Lowest: ${record.lowest}, Highest: ${record.highest}`,
          );
        }
      },
      error: (error) => {
        this.logger.error(`Error in price stream for ${tokenPair}: ${error}`);
      },
      complete: () => {
        this.logger.log(`Price stream for ${tokenPair} completed.`);
      },
    });
  }

  /**
   * Extracts the closing price from the incoming data.
   * Assumes the price is available at data.k.c.
   */
  private extractClosingPrice(data: any, tokenPair: string): number {
    if (data && data.k && data.k.c) {
      const price = parseFloat(data.k.c);
      if (isNaN(price)) {
        this.logger.warn(
          `Parsed price is NaN for ${tokenPair}. Data received: ${JSON.stringify(data)}`,
        );
      }
      return price;
    } else {
      this.logger.warn(
        `Unexpected data format for ${tokenPair}: ${JSON.stringify(data)}`,
      );
      return NaN;
    }
  }
}
