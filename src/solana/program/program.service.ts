import {
  AnchorProvider,
  Program,
  ProgramAccount,
  Wallet,
} from '@coral-xyz/anchor';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { HorseRace } from '@solana-sdk/types/horse_race';
import {
  CompetitionData,
  CompetitionProgramData,
  convertProgramToCompetitionData,
  getCompetitionAccount,
  IDL,
} from '@solana-sdk/index';

@Injectable()
export class ProgramService implements OnModuleInit {
  private program: Program<HorseRace>;
  private provider: AnchorProvider;
  private connection: Connection;
  private adminKeypair: Keypair;
  private logger = new Logger(ProgramService.name);
  private wallet: Wallet;
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.logger.log('Initializing program service');
    this.connection = new Connection(
      this.configService.get<string>('SOLANA_RPC_URL'),
      'confirmed',
    );

    // Create a keypair from the private key in env
    const privateKeyString =
      this.configService.get<string>('SOLANA_PRIVATE_KEY');
    const privateKey = new Uint8Array(JSON.parse(privateKeyString));
    this.adminKeypair = Keypair.fromSecretKey(privateKey);

    this.wallet = new Wallet(this.adminKeypair);

    // Create the provider
    const provider = new AnchorProvider(this.connection, this.wallet, {
      commitment: 'confirmed',
    });

    this.provider = provider;

    // Initialize the program
    this.program = new Program<HorseRace>(IDL as any, provider);
  }

  getConnection(): Connection {
    return this.connection;
  }

  getWallet(): Wallet {
    return this.wallet;
  }

  getProgram(): Program<HorseRace> {
    return this.program;
  }

  async getTime(): Promise<number> {
    const slot = await this.connection.getSlot();
    const blockTime = await this.connection.getBlockTime(slot);

    if (blockTime !== null) {
      this.logger.log('Current network time (Unix timestamp):', blockTime);
    } else {
      this.logger.log('Block time not available for slot', slot);
    }
    return blockTime;
  }

  async getCompetitionAccount(
    competition: PublicKey,
  ): Promise<CompetitionData> {
    const competitionAccount = await getCompetitionAccount(
      this.program,
      competition,
    );
    const programAccount: ProgramAccount<CompetitionProgramData> = {
      publicKey: competition,
      account: competitionAccount,
    };
    const competitionData = convertProgramToCompetitionData(programAccount);
    return competitionData;
  }

  getProvider(): AnchorProvider {
    return this.provider;
  }

  getAdminKeypair(): Keypair {
    return this.adminKeypair;
  }
}
