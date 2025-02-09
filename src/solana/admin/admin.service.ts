import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProgramService } from '../program/program.service';
import { Keypair, VersionedTransaction } from '@solana/web3.js';
import { Wallet, web3 } from '@coral-xyz/anchor';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private adminKeypair: Keypair;
  private wallet: Wallet;

  constructor(
    private configService: ConfigService,
    private programService: ProgramService,
  ) {
    this.initializeAdminKeypair();
  }

  private initializeAdminKeypair() {
    // Create a keypair from the private key in env
    const privateKeyString =
      this.configService.get<string>('SOLANA_PRIVATE_KEY');

    try {
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

  async signAndSendTransaction(
    transaction: VersionedTransaction,
  ): Promise<string> {
    const connection = this.programService.getConnection();
    const { blockhash } = await connection.getLatestBlockhash();

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
      const simResult = await connection.simulateTransaction(newTx, {
        replaceRecentBlockhash: true,
        sigVerify: false,
      });

      if (simResult.value.err) {
        const errorLogs =
          simResult.value.logs?.join('\n') || 'No logs available';
        throw new Error(`Simulation failed: ${errorLogs}`);
      }

      const signature = await connection.sendTransaction(newTx);
      await this.confirmTransaction(signature);
      return signature;
    } catch (error) {
      this.logger.error('Transaction failed:', error);
      throw error;
    }
  }

  async confirmTransaction(signature: string): Promise<boolean> {
    const connection = this.programService.getConnection();
    const latestBlockhash = await connection.getLatestBlockhash();

    try {
      const confirmation = await connection.confirmTransaction({
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

  getAdminPublicKey(): string {
    return this.adminKeypair.publicKey.toString();
  }
}
