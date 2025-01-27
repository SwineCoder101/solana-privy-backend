import { Body, Controller, Post, Put } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { PublicKey } from '@solana/web3.js';

class CreateCompetitionDto {
  competitionHash: string;
  tokenA: string;
  priceFeedId: string;
  adminKeys: string[];
  houseCutFactor: number;
  minPayoutRatio: number;
  interval: number;
  startTime: number;
  endTime: number;
  treasury: string;
  userId: string;
}

class UpdateCompetitionDto {
  userId: string;
  competitionKey: string;
  tokenA: string;
  priceFeedId: string;
  adminKeys: string[];
  houseCutFactor: number;
  minPayoutRatio: number;
  interval: number;
  startTime: number;
  endTime: number;
}

@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Post('create')
  async createCompetition(@Body() dto: CreateCompetitionDto) {
    return this.competitionService.createCompetitionWithPools(
      dto.userId,
      {
        competitionHash: new PublicKey(dto.competitionHash),
        tokenA: new PublicKey(dto.tokenA),
        priceFeedId: dto.priceFeedId,
        adminKeys: dto.adminKeys.map(key => new PublicKey(key)),
        houseCutFactor: dto.houseCutFactor,
        minPayoutRatio: dto.minPayoutRatio,
        interval: dto.interval,
        startTime: dto.startTime,
        endTime: dto.endTime,
        treasury: new PublicKey(dto.treasury),
      }
    );
  }

  @Put('update')
  async updateCompetition(@Body() dto: UpdateCompetitionDto) {
    return this.competitionService.updateCompetition(
      dto.userId,
      {
        competitionKey: new PublicKey(dto.competitionKey),
        houseCutFactor: dto.houseCutFactor,
        minPayoutRatio: dto.minPayoutRatio,
        interval: dto.interval,
        startTime: dto.startTime,
        endTime: dto.endTime,
        tokenA: new PublicKey(dto.tokenA),
        priceFeedId: dto.priceFeedId,
        adminKeys: []
      }
    );
  }
} 