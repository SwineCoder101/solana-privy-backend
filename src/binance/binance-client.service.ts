import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BinanceClientService {
  private readonly logger = new Logger(BinanceClientService.name);

  /**
   * Fetches aggregated trades for the given symbol and time range,
   * then calculates and returns the lowest and highest trade prices.
   *
   * @param symbol The trading pair (e.g., BTCUSDT)
   * @param startTime The start time in milliseconds
   * @param endTime The end time in milliseconds
   * @param limit (Optional) The maximum number of trades to fetch (default: 500)
   * @returns An object with the lowest and highest prices
   */
  async fetchPriceRange(
    symbol: string,
    startTime: number,
    endTime: number,
    limit: number = 500,
  ): Promise<{ lowest: number; highest: number }> {
    const url = 'https://api.binance.com/api/v3/aggTrades';

    try {
      const response = await axios.get(url, {
        params: {
          symbol,
          startTime,
          endTime,
          limit,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // The response data is expected to be an array of aggregated trades.
      // Each trade object has a property "p" representing the price (as a string).
      const trades: any[] = response.data;

      if (!trades || trades.length === 0) {
        this.logger.warn(
          `No trades found for ${symbol} between ${startTime} and ${endTime}.`,
        );
        return { lowest: NaN, highest: NaN };
      }

      // Convert each price from string to number.
      const prices = trades.map((trade) => parseFloat(trade.p));

      const lowest = Math.min(...prices);
      const highest = Math.max(...prices);

      this.logger.log(
        `Fetched ${trades.length} trades for ${symbol}. Lowest: ${lowest}, Highest: ${highest}`,
      );

      return { lowest, highest };
    } catch (error) {
      this.logger.error(
        `Error fetching aggregated trades for ${symbol}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
