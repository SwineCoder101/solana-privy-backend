import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { OrderService } from './order.service';
import { PrivyService } from 'src/privy/privy.service';

class CreateBetDto {
  userId: string;
  amount: number;
  lowerBoundPrice: number;
  upperBoundPrice: number;
  poolKey: string;
  competitionKey: string;
  leverageMultiplier: number;
}

class CancelBetDto {
  userId: string;
  poolKey: string;
  userKey: string;
}

interface CreateBetResponse {
  txHash: string;
}

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(
    private readonly orderService: OrderService,
    private readonly privyService: PrivyService,
  ) {}

  @Post('create-bet')
  async createBet(@Body() dto: CreateBetDto): Promise<CreateBetResponse> {
    this.logger.log('Creating bet with params: ', dto);

    const createBetResponse: CreateBetResponse =
      await this.orderService.createBet(dto.userId, {
        amount: dto.amount,
        lowerBoundPrice: dto.lowerBoundPrice,
        upperBoundPrice: dto.upperBoundPrice,
        poolKey: new PublicKey(dto.poolKey),
        competitionKey: new PublicKey(dto.competitionKey),
        leverageMultiplier: dto.leverageMultiplier,
      });

    return createBetResponse;
  }

  @Post('cancel-bet')
  async cancelBet(@Body() dto: CancelBetDto) {
    this.logger.log('Cancelling bet with params: ', dto);
    let user;

    if (!dto.userKey) {
      const walletDetails = await this.privyService.getDelegatedWallet(
        dto.userId,
      );
      user = new PublicKey(walletDetails.address);
      this.logger.log('finding embedded wallet for user: ', user.toBase58());
    } else {
      user = new PublicKey(dto.userKey);
      this.logger.log('using user key: ', user.toBase58());
    }

    return this.orderService.cancelBet(dto.userId, {
      user,
      poolKey: new PublicKey(dto.poolKey),
    });
  }
}
