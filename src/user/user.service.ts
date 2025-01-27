import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReferralService } from '../referral/referral.service';
import { User } from '@prisma/client';
// import { S3Service } from 'src/s3/s3.service';
import { RankService } from 'src/rank/rank.service';
import { UpdateConnectionRequestDto } from './dto/update-connection-request.dto';
import { SendConnectionRequestDto } from './dto/send-connection-request.dto';
import { GoogleCloudStorageService } from 'src/google-cloud-storage/google-cloud-storage.service';
import { UserGateway } from './user.gateway';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private prisma: PrismaService,
    private referralService: ReferralService,
    // private s3Service: S3Service,
    private rankService: RankService,
    private gcloudService: GoogleCloudStorageService,
    private userGateway: UserGateway,
  ) { }

  async onModuleInit() {
    await this.rankService.initializeRanks();
  }

  // async initializeRanksForExistingUsers() {
  //   try {
  //     await this.rankService.initializeRanks();
  //     this.logger.log('Ranks initialized for existing users');
  //   } catch (error) {
  //     this.logger.error(`Error initializing ranks: ${error.message}`);
  //     throw error;
  //   }
  // }

  async createUser(createUserDto: CreateUserDto): Promise<User> {

    const prisma = this.prisma;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { referrerInviteLink, ...userData } = createUserDto;

      
      const rank = await this.rankService.rankNewUser();
      const result = await prisma.$transaction(
        async (tx) => {
          const newUser = await tx.user.create({
            data: {
              ...userData,
              telegramId: BigInt(createUserDto.telegramId),
              freelancerRoleTypes: createUserDto.freelancerRoleTypes || [],
              inviteLink: `${createUserDto.inviteLink}-${new Date().getTime().toString()}`,
              inviteLinkUsageCount: 0,
              isOnline: false,
              lastOnline: new Date(),
              rank: rank,
            },
          });

          // let referrerId: number | undefined;

          // if (referrerInviteLink) {
          //   const referral = await this.referralService.createReferral(
          //     referrerInviteLink,
          //     newUser.id,
          //     tx,
          //   );
          //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
          //   referrerId = referral.referrerId;
          // }

          // Rank the new user
          // await this.rankService.rankNewUser({
          //   telegramId: newUser.telegramId.toString(),
          //   firstName: newUser.firstName,
          //   age: newUser.age,
          //   referrerId: referrerId,
          // });
          // this.userGateway.broadcastNewUser(JSON.stringify(newUser));
          return newUser;
        },
        { timeout: 10000 },
      );

      return result;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new Error(error);
    }
  }

  async getReferrerRank(
    userId: number,
  ): Promise<{ rank: number; username: string } | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          referralReceived: {
            include: {
              referrer: {
                select: {
                  rank: true,
                  username: true,
                },
              },
            },
          },
        },
      });

      if (!user || !user.referralReceived) {
        return null; // User was not invited or doesn't exist
      }

      return {
        rank: user.referralReceived.referrer.rank,
        username: user.referralReceived.referrer.username,
      };
    } catch (error) {
      this.logger.error(`Error fetching referrer rank: ${error.message}`);
      throw error;
    }
  }

  async updateUserById(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.prisma.user.update({
        where: { id },
        data: { ...updateUserDto },
      });
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const result = await this.prisma.user.findMany();
      return result;
    } catch (error) {
      this.logger.error(`Error fetching all users: ${error.message}`);
      throw new Error('Error fetching users');
    }
  }

  async getUserByTelegramId(telegramId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`Error fetching user by Telegram ID: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({ where: { id } });
      return user;
    } catch (error) {
      this.logger.error(`Error removing user: ${error.message}`);
      throw new Error('Error removing user');
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Error fetching user by ID: ${error.message}`);
      throw error;
    }
  }

  async updateUserHeartbeat(userId: number): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { lastOnline: new Date() },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`Error updating user heartbeat: ${error.message}`);
      throw error;
    }
  }

  isUserOnline(lastOnline: Date): boolean {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    return lastOnline > oneMinuteAgo;
  }

  async uploadUserPhoto(
    userId: number,
    fileBuffer: Buffer,
    mimetype: string,
    originalname: string,
  ): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userPhotoPrefix = 'talentgram/user-photos/'
      const fileKey = `${userPhotoPrefix}${userId}-${Date.now()}-${originalname}`;
      await this.gcloudService.uploadFile(
        fileBuffer,
        mimetype,
        fileKey,
      );


      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { photoUrl: `/user-photos/${fileKey}` },
      });

      return updatedUser;
    } catch (error) {
      this.logger.error(`Error uploading user photo: ${error.message}`);
      throw error;
    }
  }

  async sendConnectionRequest(
    sendConnectionRequestDto: SendConnectionRequestDto,
  ) {
    try {
      const { senderId, receiverId, message } = sendConnectionRequestDto;

      // Check if users exist
      const [sender, receiver] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: senderId } }),
        this.prisma.user.findUnique({ where: { id: receiverId } }),
      ]);

      if (!sender || !receiver) {
        throw new NotFoundException('One or both users not found');
      }

      // Check receiver's privacy settings
      if (receiver.connectionPrivacy === 'PRIVATE') {
        throw new BadRequestException(
          'User does not accept connection requests',
        );
      }

      if (receiver.connectionPrivacy === 'MUTUAL') {
        // Check for mutual connections
        const mutualConnections = await this.prisma.connection.count({
          where: {
            OR: [
              {
                AND: [
                  { user1Id: senderId },
                  {
                    OR: [
                      {
                        user2Id: {
                          in: await this.getConnectedUserIds(receiverId),
                        },
                      },
                    ],
                  },
                ],
              },
              {
                AND: [
                  { user2Id: senderId },
                  {
                    OR: [
                      {
                        user1Id: {
                          in: await this.getConnectedUserIds(receiverId),
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        });

        if (mutualConnections === 0) {
          throw new BadRequestException(
            'You need mutual connections to send request to this user',
          );
        }
      }

      // Check if request already exists
      const existingRequest = await this.prisma.connectionRequest.findFirst({
        where: {
          OR: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
          status: 'PENDING',
        },
      });

      if (existingRequest) {
        throw new BadRequestException('Connection request already exists');
      }

      // Check if already connected
      const existingConnection = await this.prisma.connection.findFirst({
        where: {
          OR: [
            { user1Id: senderId, user2Id: receiverId },
            { user1Id: receiverId, user2Id: senderId },
          ],
        },
      });

      if (existingConnection) {
        throw new BadRequestException('Users are already connected');
      }

      return await this.prisma.connectionRequest.create({
        data: {
          senderId,
          receiverId,
          message,
          status: 'PENDING',
        },
      });
    } catch (error) {
      this.logger.error(`Error sending connection request: ${error.message}`);
      throw error;
    }
  }

  async handleConnectionRequest(
    requestId: number,
    updateConnectionRequestDto: UpdateConnectionRequestDto,
  ) {
    try {
      const { status } = updateConnectionRequestDto;

      const request = await this.prisma.connectionRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new NotFoundException('Connection request not found');
      }

      if (request.status !== 'PENDING') {
        throw new BadRequestException('Request has already been handled');
      }

      if (status === 'ACCEPTED') {
        // Create connection in a transaction
        return await this.prisma.$transaction(async (tx) => {
          // Update request status
          const updatedRequest = await tx.connectionRequest.update({
            where: { id: requestId },
            data: { status },
          });

          // Create connection
          await tx.connection.create({
            data: {
              user1Id: request.senderId,
              user2Id: request.receiverId,
            },
          });

          return updatedRequest;
        });
      }

      // For DECLINED or WITHDRAWN, just update the status
      return await this.prisma.connectionRequest.update({
        where: { id: requestId },
        data: { status },
      });
    } catch (error) {
      this.logger.error(`Error handling connection request: ${error.message}`);
      throw error;
    }
  }

  async getUserConnections(telegramId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          telegramId: BigInt(telegramId)
        }
      })
      const connections = await this.prisma.connection.findMany({
        where: {
          OR: [{ user1Id: user.id }, { user2Id: user.id }],
        },
        include: {
          user1: true,
          user2: true,
        },
      });

      // Extract and deduplicate connected users
      return connections.map((conn) =>
        conn.user1Id === user.id ? conn.user2 : conn.user1,
      );
    } catch (error) {
      this.logger.error(`Error getting user connections: ${error.message}`);
      throw error;
    }
  }

  async getPendingRequests(userId: number) {
    try {
      return await this.prisma.connectionRequest.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
          status: 'PENDING',
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
    } catch (error) {
      this.logger.error(`Error getting pending requests: ${error.message}`);
      throw error;
    }
  }

  // Helper method for getting connected user IDs
  private async getConnectedUserIds(userId: number): Promise<number[]> {
    const connections = await this.prisma.connection.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });

    return connections.map((conn) =>
      conn.user1Id === userId ? conn.user2Id : conn.user1Id,
    );
  }

  async followUser(followerId: number, followedId: number) {
    try {
      // Check if users exist
      const [follower, followed] = await Promise.all([
        this.prisma.user.findUnique({ where: { id: followerId } }),
        this.prisma.user.findUnique({ where: { id: followedId } }),
      ]);

      if (!follower || !followed) {
        throw new NotFoundException('One or both users not found');
      }

      // Check if already following
      const existingFollow = await this.prisma.follow.findUnique({
        where: {
          followerId_followedId: {
            followerId,
            followedId,
          },
        },
      });

      if (existingFollow) {
        throw new BadRequestException('Already following this user');
      }

      // Create follow relationship
      return await this.prisma.follow.create({
        data: {
          followerId,
          followedId,
        },
        include: {
          followed: true,
        },
      });
    } catch (error) {
      this.logger.error(`Error following user: ${error.message}`);
      throw error;
    }
  }

  async unfollowUser(followerId: number, followedId: number) {
    try {
      // Check if follow relationship exists
      const existingFollow = await this.prisma.follow.findUnique({
        where: {
          followerId_followedId: {
            followerId,
            followedId,
          },
        },
      });

      if (!existingFollow) {
        throw new NotFoundException('Not following this user');
      }

      // Remove follow relationship
      return await this.prisma.follow.delete({
        where: {
          followerId_followedId: {
            followerId,
            followedId,
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error unfollowing user: ${error.message}`);
      throw error;
    }
  }

  async getFollowers(userId: number) {
    try {
      return await this.prisma.follow.findMany({
        where: { followedId: userId },
        include: {
          follower: true,
        },
      });
    } catch (error) {
      this.logger.error(`Error getting followers: ${error.message}`);
      throw error;
    }
  }

  async getFollowings(userId: number) {
    try {
      return await this.prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          followed: true,
        },
      });
    } catch (error) {
      this.logger.error(`Error getting followings: ${error.message}`);
      throw error;
    }
  }

  async isFollowing(followerId: number, followedId: number): Promise<boolean> {
    try {
      const follow = await this.prisma.follow.findUnique({
        where: {
          followerId_followedId: {
            followerId,
            followedId,
          },
        },
      });

      return !!follow;
    } catch (error) {
      this.logger.error(`Error checking follow status: ${error.message}`);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { username },
      });

      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Error fetching user by username: ${error.message}`);
      throw error;
    }
  }

  async getTopRankedUsers(): Promise<any> {
    try {
      const topRankedUsers = await this.rankService.getTopRankedUsers();
      return topRankedUsers;
    } catch (error) {
      this.logger.error(`Error fetching top ranked users: ${error.message}`);
      throw error;
    }
  }

  async getReferralsLeaderboard(page: number, limit: number) {
    const skip = (page - 1) * limit;

    // 1) Get total number of *unique* referrers (for total pages)
    //    Because groupBy(referrerId) returns an array of distinct referrers, the length = total distinct referrer IDs
    const allReferrers = await this.prisma.referral.groupBy({
      by: ['referrerId'],
    });
    const totalCount = allReferrers.length;
    const totalPages = Math.ceil(totalCount / limit);

    if (totalCount === 0) {

      return {
        data: [],
        meta: {
          totalCount,
          currentPage: page,
          totalPages,
        },
      };
    }


    const groupedReferrals = await this.prisma.referral.groupBy({
      by: ['referrerId'],
      _count: {
        referrerId: true,
      },
      orderBy: {
        _count: {
          referrerId: 'desc',
        },
      },
      skip,
      take: limit,
    });


    const referrerIds = groupedReferrals.map((r) => r.referrerId);
    const referrers = await this.prisma.user.findMany({
      where: { id: { in: referrerIds } },
    });


    const userMap = new Map<number, User>();
    referrers.forEach((u) => userMap.set(u.id, u));


    const data = groupedReferrals.map((item) => ({
      user: userMap.get(item.referrerId),
      inviteCount: item._count.referrerId,
    }));

    return {
      data,
      meta: {
        totalCount,
        currentPage: page,
        totalPages,
      },
    };
  }

}
