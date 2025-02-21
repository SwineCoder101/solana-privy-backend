import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

export type PriceData = {
  price: number;
  timestamp: number;
};

@Injectable()
export class PythService {
  private readonly logger = new Logger(PythService.name);

  constructor(private readonly httpService: HttpService) {}

  streamPrice(tokenPair: string) {
    // Replace with the actual Pyth API endpoint URL for the token pair.
    const url = `https://pyth.network/api/pricefeed/${tokenPair}`;
    return this.httpService.get(url).pipe(
      map((response) => {
        // Assuming the API response structure is: { prices: PriceData[] }
        const data = response.data;
        return data.prices as PriceData[];
      }),
    );
  }

  async getPriceRange(
    priceFeedId: string,
    startTime: number,
    endTime: number,
  ): Promise<{ lowerBoundPrice: number; upperBoundPrice: number }> {
    // Fetch prices from the Pyth API as an array of PriceData.
    const pricesData: PriceData[] = await lastValueFrom(
      this.streamPrice(priceFeedId),
    );

    // Filter the data to only include prices between startTime and endTime.
    const filteredPrices = pricesData.filter(
      (data) => data.timestamp >= startTime && data.timestamp <= endTime,
    );

    if (filteredPrices.length === 0) {
      throw new Error('No price data available for the specified time range.');
    }

    // Map the filtered data to just the price values.
    const prices = filteredPrices.map((data) => data.price);
    const lowerBoundPrice = Math.min(...prices);
    const upperBoundPrice = Math.max(...prices);

    return { lowerBoundPrice, upperBoundPrice };
  }
}
