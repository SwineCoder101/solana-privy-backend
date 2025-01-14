import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Referral } from '@prisma/client';

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createReferral(
    inviteLink: string,
    referredUserId: number,
    tx: Prisma.TransactionClient,
  ): Promise<Referral> {
    try {
      const referrer = await tx.user.findUnique({
        where: { inviteLink },
      });

      if (!referrer) {
        throw new Error('Referrer not found');
      }

      const referredUser = await tx.user.findUnique({
        where: { id: referredUserId },
      });

      if (!referredUser) {
        throw new Error('Referred user not found');
      }

      if (referrer.id === referredUser.id) {
        throw new Error('Referrer and referred user cannot be the same person');
      }

      const existingReferral = await tx.referral.findUnique({
        where: { referredUserId: referredUser.id },
      });

      if (existingReferral) {
        throw new Error('This user has already been referred by someone else');
      }

      // Increment the inviteLinkUsageCount
      await tx.user.update({
        where: { id: referrer.id },
        data: { inviteLinkUsageCount: { increment: 1 } },
      });

      const referral = await tx.referral.create({
        data: {
          referrer: { connect: { id: referrer.id } },
          referredUser: { connect: { id: referredUser.id } },
        },
      });

      return referral;
    } catch (error) {
      this.logger.error(`Error creating referral: ${error.message}`);
      throw error; // Throw the same error to propagate it
    }
  }

  async clear(): Promise<void> {
    try {
      await this.prisma.referral.deleteMany();
    } catch (error) {
      this.logger.error(`Error clearing referrals: ${error.message}`);
      throw new Error('Error clearing referrals');
    }
  }
}
