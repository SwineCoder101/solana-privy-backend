import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCompetitionDto {
  @IsString()
  tokenA: string;

  @IsString()
  priceFeedId: string;

  @IsNumber()
  @IsPositive()
  houseCutFactor: number;

  @IsNumber()
  @IsPositive()
  minPayoutRatio: number;

  @IsNumber()
  @IsPositive()
  interval: number;

  @IsNumber()
  @IsPositive()
  startTime: number;

  @IsNumber()
  @IsPositive()
  endTime: number;

  @IsString()
  treasury: string;
}
