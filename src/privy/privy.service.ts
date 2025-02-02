import { web3 } from '@coral-xyz/anchor';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrivyClient, WalletWithMetadata } from '@privy-io/server-auth';
import { SendTransactionError, VersionedTransaction } from '@solana/web3.js';
import { ProgramService } from 'src/solana/program/program.service';
@Injectable()
export class PrivyService {
  private privyClient: PrivyClient;
  private logger = new Logger(PrivyService.name);

  constructor(
    private configService: ConfigService,
    private programService: ProgramService,
  ) {
    this.privyClient = new PrivyClient(
      this.configService.get<string>('privy.appId'),
      this.configService.get<string>('privy.appSecret'),
      {
        walletApi: {
          authorizationPrivateKey: this.configService.get<string>(
            'privy.authorizationSigningKey',
          ),
        },
      },
    );
  }

  async getDelegatedWallet(userId: string): Promise<WalletWithMetadata> {
    const user = await this.privyClient.getUserById(
      'cm6gn06bq021n216ajbxqu5dh',
    );

    this.logger.log('User: ', user);

    const embeddedWallets = user.linkedAccounts.filter(
      (account): account is WalletWithMetadata =>
        account.type === 'wallet' && account.walletClientType === 'privy',
    );

    const delegatedWallets = embeddedWallets.filter(
      (wallet) => wallet.delegated,
    );

    this.logger.log('Embedded wallets: ', embeddedWallets);

    const delegatedWallet = delegatedWallets.filter(
      (wallet) =>
        wallet.chainId === 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' ||
        wallet.chainId?.includes('solana'),
    )[0];

    this.logger.log('Delegated wallet: ', delegatedWallet);

    return delegatedWallet;
  }

  async executeDelegatedActionWithWallet(
    wallet: WalletWithMetadata,
    transaction: any,
    chainId: string = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  ): Promise<string> {
    try {
      const signedTxResponse =
        await this.privyClient.walletApi.solana.signTransaction({
          address: wallet.address,
          chainType: 'solana',
          caip2: chainId,
          transaction: transaction,
        });

      const signedVtx =
        signedTxResponse.signedTransaction as VersionedTransaction;

      const connection = this.programService.getConnection();

      const simResult = await connection.simulateTransaction(signedVtx, {
        replaceRecentBlockhash: true,
        sigVerify: false,
      });

      if (simResult.value.err) {
        const errorLogs =
          simResult.value.logs?.join('\n') || 'No logs available';
        throw new InternalServerErrorException(
          `Simulation failed: ${errorLogs}`,
        );
      }

      try {
        const hash = await connection.sendTransaction(signedVtx);
        return hash;
      } catch (error) {
        if (error instanceof SendTransactionError) {
          this.logger.error('Transaction Error Logs:', error.logs);
          this.logger.error('Transaction Error Message:', error.message);
        }
        throw new InternalServerErrorException(
          'Failed to execute transaction.',
        );
      }
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw new InternalServerErrorException('Failed to execute transaction.');
    }
  }

  async executeDelegatedAction(
    userId: string,
    transaction: any,
    chainId: string = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  ): Promise<string> {
    try {
      const delegatedWallet = await this.getDelegatedWallet(userId);
      return this.executeDelegatedActionWithWallet(
        delegatedWallet,
        transaction,
        chainId,
      );
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw new InternalServerErrorException('Failed to execute transaction.');
    }
  }
}
