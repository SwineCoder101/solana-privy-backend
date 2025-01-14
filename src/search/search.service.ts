import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  constructor(private prisma: PrismaService) {}

  async searchUsers(query: string, page: number, limit: number) {
    try {
      const searchTerm = query.trim().toLowerCase();
      const skip = (page - 1) * limit;

      const [results, total] = await Promise.all([
        this.prisma.user.findMany({
          where: {
            OR: [
              { username: { contains: searchTerm, mode: 'insensitive' } },
              { firstName: { contains: searchTerm, mode: 'insensitive' } },
              { lastName: { contains: searchTerm, mode: 'insensitive' } },
              {
                AND: [
                  {
                    firstName: {
                      contains: searchTerm.split(' ')[0],
                      mode: 'insensitive',
                    },
                  },
                  {
                    lastName: {
                      contains: searchTerm.split(' ')[1] || '',
                      mode: 'insensitive',
                    },
                  },
                ],
              },
              { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
          skip,
          take: limit,
        }),
        this.prisma.user.count({
          where: {
            OR: [
              { username: { contains: searchTerm, mode: 'insensitive' } },
              { firstName: { contains: searchTerm, mode: 'insensitive' } },
              { lastName: { contains: searchTerm, mode: 'insensitive' } },
              {
                AND: [
                  {
                    firstName: {
                      contains: searchTerm.split(' ')[0],
                      mode: 'insensitive',
                    },
                  },
                  {
                    lastName: {
                      contains: searchTerm.split(' ')[1] || '',
                      mode: 'insensitive',
                    },
                  },
                ],
              },
              { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
        }),
      ]);

      return { results, total };
    } catch (error) {
      this.logger.error(`Error in user search: ${error.message}`);
      throw new Error('Error in user search');
    }
  }

  async searchJobs(query: string, page: number, limit: number) {
    try {
      const searchTerm = query.trim().toLowerCase();
      const skip = (page - 1) * limit;

      const [results, total] = await Promise.all([
        this.prisma.job.findMany({
          where: {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
          skip,
          take: limit,
        }),
        this.prisma.job.count({
          where: {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
        }),
      ]);

      return { results, total };
    } catch (error) {
      this.logger.error(`Error in job search: ${error.message}`);
      throw new Error('Error in job search');
    }
  }

  async saveRecentSearch(userId: number, query: string) {
    try {
      await this.prisma.recentSearch.create({
        data: {
          userId,
          query,
        },
      });
    } catch (error) {
      this.logger.error(`Error saving recent search: ${error.message}`);
      // You might want to handle this error differently, perhaps just log it without throwing
    }
  }

  async getRecentSearches(userId: number, limit: number) {
    try {
      const recentSearches = await this.prisma.recentSearch.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return recentSearches;
    } catch (error) {
      this.logger.error(`Error fetching recent searches: ${error.message}`);
      throw new Error('Error fetching recent searches');
    }
  }
}
