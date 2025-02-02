import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Keypair, PublicKey } from '@solana/web3.js';
import { PrivyService } from '../../privy/privy.service';
import { ProgramService } from '../program/program.service';
import { updateFeed } from '@solana-sdk/instructions/admin/update-pool-feed';

@Injectable()
export class OracleService {
  constructor(
    private configService: ConfigService,
    private privyService: PrivyService,
    private programService: ProgramService,
  ) {}

  async updateFeed(
    userId: string,
    params: {
      poolKey: PublicKey;
      priceFeedId: string;
      priceFeedAccount: PublicKey;
    },
  ) {
    const delegatedWallet = await this.privyService.getDelegatedWallet(userId);

    // Create a keypair for the authority
    const authorityPrivateKey =
      this.configService.get<string>('SOLANA_PRIVATE_KEY');
    const authorityKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(authorityPrivateKey)),
    );
    const transaction = await updateFeed(
      this.programService.getProgram() as any,
      authorityKeypair,
      params.poolKey,
      params.priceFeedId,
      params.priceFeedAccount,
    );

    return this.privyService.executeDelegatedActionWithWallet(
      delegatedWallet,
      transaction,
    );
  }
}
