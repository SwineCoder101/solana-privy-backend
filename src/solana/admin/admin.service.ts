import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProgramService } from '../program/program.service';
import {
  Connection,
  Keypair,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js';
import { Program, Wallet, web3 } from '@coral-xyz/anchor';
import { HorseRace } from '@solana-sdk/utils';

@Injectable()
export class AdminService implements OnModuleInit {
  private readonly logger = new Logger(AdminService.name);
  private adminKeypair: Keypair;
  private program: Program<HorseRace>;
  private wallet: Wallet;
  private connection: Connection;

  constructor(
    private readonly configService: ConfigService,
    private readonly programService: ProgramService,
  ) {}

  onModuleInit() {
    this.logger.log('Initializing admin service');
    this.initializeAdminKeypair();
    this.program = this.programService.getProgram();
    this.connection = this.programService.getConnection();
    this.wallet = this.programService.getWallet();
  }

  private initializeAdminKeypair() {
    // Create a keypair from the private key in env
    const privateKeyString =
      this.configService.get<string>('SOLANA_PRIVATE_KEY');

    try {
      this.connection = this.programService.getConnection();
      const privateKey = new Uint8Array(JSON.parse(privateKeyString));
      this.adminKeypair = Keypair.fromSecretKey(privateKey);

      this.wallet = new Wallet(this.adminKeypair);
      this.logger.log(
        `Admin wallet initialized: ${this.adminKeypair.publicKey.toString()}`,
      );
    } catch (error) {
      this.logger.error('Failed to initialize admin wallet:', error);
      throw error;
    }
  }

  async signSendAndConfirmTransaction(
    transaction: VersionedTransaction,
  ): Promise<string> {
    this.logger.log('Using connection: ', this.connection.rpcEndpoint);
    const { blockhash } = await this.connection.getLatestBlockhash();
    this.logger.log('signing and sending transaction: ', transaction.message);

    const message = transaction.message;
    const newMessage = new web3.TransactionMessage({
      payerKey: message.staticAccountKeys[0],
      instructions: message.compiledInstructions.map((ix) => ({
        programId: message.staticAccountKeys[ix.programIdIndex],
        keys: ix.accountKeyIndexes.map((accountIndex) => ({
          pubkey: message.staticAccountKeys[accountIndex],
          isSigner: message.isAccountSigner(accountIndex),
          isWritable: message.isAccountWritable(accountIndex),
        })),
        data: Buffer.from(ix.data),
      })),
      recentBlockhash: blockhash,
    });

    const newTx = new web3.VersionedTransaction(
      newMessage.compileToV0Message(),
    );
    newTx.sign([this.adminKeypair]);

    try {
      const simResult = await this.connection.simulateTransaction(newTx, {
        replaceRecentBlockhash: true,
        sigVerify: false,
      });

      if (simResult.value.err) {
        const errorLogs =
          simResult.value.logs?.join('\n') || 'No logs available';
        this.logger.error(`Simulation failed: ${errorLogs}`);
        throw new Error(`Simulation failed: ${errorLogs}`);
      }

      this.logger.log('simulation result: ', simResult);

      const signature = await this.connection.sendTransaction(newTx);
      this.logger.log('transaction sent: ', signature);
      await this.confirmTransaction(signature);
      return signature;
    } catch (error) {
      this.logger.error('Transaction failed:', error);
      throw error;
    }
  }

  async confirmTransaction(signature: string): Promise<boolean> {
    const latestBlockhash = await this.connection.getLatestBlockhash();
    this.logger.log('Confirming transaction: ', signature);
    this.logger.log('Blockhash: ', latestBlockhash.blockhash);

    try {
      const confirmation = await this.connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      return !confirmation.value.err;
    } catch (error) {
      this.logger.error('Transaction confirmation failed:', error);
      throw error;
    }
  }

  async signAndSendTransaction(vTx: VersionedTransaction): Promise<string> {
    const { blockhash } = await this.programService
      .getConnection()
      .getLatestBlockhash();

    const message = vTx.message;
    const newMessage = new web3.TransactionMessage({
      payerKey: message.staticAccountKeys[0],
      instructions: message.compiledInstructions.map((ix) => ({
        programId: message.staticAccountKeys[ix.programIdIndex],
        keys: ix.accountKeyIndexes.map((accountIndex) => ({
          pubkey: message.staticAccountKeys[accountIndex],
          isSigner: message.isAccountSigner(accountIndex),
          isWritable: message.isAccountWritable(accountIndex),
        })),
        data: Buffer.from(ix.data),
      })),
      recentBlockhash: blockhash,
    });

    const newTx = new web3.VersionedTransaction(
      newMessage.compileToV0Message(),
    );
    newTx.sign([this.adminKeypair]);

    try {
      const simResult = await this.connection.simulateTransaction(newTx, {
        replaceRecentBlockhash: true,
        sigVerify: false,
      });

      if (simResult.value.err) {
        const errorLogs =
          simResult.value.logs?.join('\n') || 'No logs available';
        throw new Error(`Simulation failed: ${errorLogs}`);
      }

      return await this.connection.sendTransaction(newTx);
    } catch (error) {
      // Type guard to check if error is an Error object
      if (error instanceof Error) {
        throw new Error(`Submission failed: ${error.message}`);
      }
      // If it's not an Error object, convert it to string
      throw new Error(`Submission failed: ${String(error)}`);
    }
  }

  getAdminPublicKeyString(): string {
    return this.adminKeypair.publicKey.toString();
  }

  getProgram(): Program<HorseRace> {
    return this.program;
  }

  getWallet(): Wallet {
    return this.wallet;
  }

  getConnection(): Connection {
    return this.connection;
  }

  getAdminPublicKey(): PublicKey {
    return this.adminKeypair.publicKey;
  }
}
