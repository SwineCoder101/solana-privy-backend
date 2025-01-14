import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RankService {
  constructor(private prisma: PrismaService) {}

// Function to initialize ranks randomly for all existing users
async initializeRanks() {
  // Get all users from the database
  const users = await this.prisma.user.findMany({
    select: { id: true }, // Only fetch user ids
  });

  // Shuffle users array to randomize their order
  const shuffledUsers = users.sort(() => 0.5 - Math.random());

  // Rank users randomly
  for (let i = 0; i < shuffledUsers.length; i++) {
    await this.prisma.user.update({
      where: { id: shuffledUsers[i].id },
      data: { rank: i + 1 },
    });
  }
}

// Function to rank new user, incrementing rank from the last user
async rankNewUser() {
  // Get the last rank assigned to any user
  const lastUser = await this.prisma.user.findFirst({
    orderBy: { rank: 'desc' },
    select: { rank: true },
  });

  const lastRank = lastUser?.rank || 0;

  // Assign rank to the new user as lastRank + 1
  const newRank = lastRank + 1;

  return newRank; // Return new rank to be assigned to the new user
}

  async getTopRankedUsers(limit: number = 10) {
    return await this.prisma.user.findMany({
      orderBy: { rank: 'asc' },
      take: limit,
      select: {
        id: true,
        username: true,
        rank: true,
      },
    });
  }
}
