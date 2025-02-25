import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CompetitionPoolParams } from '@solana-sdk/instructions/admin/create-competition-with-pools';
import { PublicKey } from '@solana/web3.js';
import { AdminService } from '../admin/admin.service';
import { CompetitionService } from './competition.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';

@Controller('competition')
export class CompetitionController {
  private readonly logger = new Logger(CompetitionController.name);

  constructor(
    private readonly competitionService: CompetitionService,
    private readonly adminService: AdminService,
  ) {}

  @Post()
  async create(@Body() dto: CreateCompetitionDto) {
    this.logger.log(dto);

    const params: CompetitionPoolParams = {
      admin: this.adminService.getAdminPublicKey(),
      tokenA: new PublicKey(dto.tokenA),
      priceFeedId: dto.priceFeedId,
      adminKeys: [this.adminService.getAdminPublicKey()],
      houseCutFactor: dto.houseCutFactor,
      minPayoutRatio: dto.minPayoutRatio,
      interval: dto.interval,
      startTime: dto.startTime,
      endTime: dto.endTime,
      treasury: new PublicKey(dto.treasury),
    };
    this.logger.log(params);

    return this.competitionService.createCompetitionWithPools(params);
  }

  // @Put('update')
  // async updateCompetition(@Body() dto: UpdateCompetitionDto) {
  //   return this.competitionService.updateCompetition({
  //     competitionKey: new PublicKey(dto.competitionKey),
  //     houseCutFactor: dto.houseCutFactor,
  //     minPayoutRatio: dto.minPayoutRatio,
  //     interval: dto.interval,
  //     startTime: dto.startTime,
  //     endTime: dto.endTime,
  //     tokenA: new PublicKey(dto.tokenA),
  //     priceFeedId: dto.priceFeedId,
  //     adminKeys: [],
  //   });
  // }
}
