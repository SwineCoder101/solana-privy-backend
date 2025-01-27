import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Keypair } from '@solana/web3.js';
import { HorseRace, IDL } from '../sdk/lib/sdk/src';

@Injectable()
export class ProgramService implements OnModuleInit {
  private program: Program<HorseRace>;
  private provider: AnchorProvider;
  private connection: Connection;
  private adminKeypair: Keypair;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.connection = new Connection(
      this.configService.get<string>('SOLANA_RPC_URL'),
      'confirmed'
    );

    // Create a keypair from the private key in env
    const privateKeyString = this.configService.get<string>('SOLANA_PRIVATE_KEY');
    const privateKey = new Uint8Array(JSON.parse(privateKeyString));
    this.adminKeypair = Keypair.fromSecretKey(privateKey);

    const wallet = new Wallet(this.adminKeypair);

    // Create the provider
    const provider = new AnchorProvider(
      this.connection,
      wallet,
      { commitment: 'confirmed' }
    );

    this.provider = provider;

    // Initialize the program
    this.program = new Program<HorseRace>(
      IDL,
      provider
    );
  }

  getProgram(): Program<HorseRace> {
    return this.program;
  }
} 