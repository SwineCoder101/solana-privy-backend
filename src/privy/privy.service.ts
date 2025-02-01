import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrivyClient, WalletWithMetadata } from '@privy-io/server-auth';

@Injectable()
export class PrivyService {
  private privyClient: PrivyClient;

  constructor(private configService: ConfigService) {
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
    const user = await this.privyClient.getUserById(userId);

    const embeddedWallets = user.linkedAccounts.filter(
      (account): account is WalletWithMetadata =>
        account.type === 'wallet' && account.walletClientType === 'privy',
    );

    const delegatedWallets = embeddedWallets.filter(
      (wallet) => wallet.delegated,
    );

    return delegatedWallets[0];
  }

  async executeDelegatedActionWithWallet(
    wallet: WalletWithMetadata,
    transaction: any,
    chainId: string = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  ): Promise<string> {
    try {
      const { hash } =
        await this.privyClient.walletApi.solana.signAndSendTransaction({
          address: wallet.address,
          chainType: 'solana',
          caip2: chainId,
          transaction: transaction,
        });

      return hash;
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
