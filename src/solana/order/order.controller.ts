import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { OrderService } from './order.service';

class CreateBetDto {
  userId: string;
  amount: number;
  lowerBoundPrice: number;
  upperBoundPrice: number;
  poolKey: string;
  competitionKey: string;
}

class CancelBetDto {
  userId: string;
  poolKey: string;
  betHash: string;
}

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService) {}

  @Post('create-bet')
  async createBet(@Body() dto: CreateBetDto) {
    this.logger.log('Creating bet with params: ', dto);

    const createBetResponse = await this.orderService.createBet(dto.userId, {
      amount: dto.amount,
      lowerBoundPrice: dto.lowerBoundPrice,
      upperBoundPrice: dto.upperBoundPrice,
      poolKey: new PublicKey(dto.poolKey),
      competitionKey: new PublicKey(dto.competitionKey),
    });
    return createBetResponse;
  }

  @Post('cancel-bet')
  async cancelBet(@Body() dto: CancelBetDto) {
    return this.orderService.cancelBet(dto.userId, {
      poolKey: new PublicKey(dto.poolKey),
      betHash: new PublicKey(dto.betHash),
    });
  }
}
