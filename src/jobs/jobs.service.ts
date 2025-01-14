import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '..//prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Category, Job } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // await this.initializeRanksForExistingUsers();
    await this.createJobCategories();
  }

  async create(createJobDto: CreateJobDto) {
    const { posterId, ...rest } = createJobDto;

    if (!createJobDto.categories || createJobDto.categories.length === 0) {
      throw new BadRequestException('The categories array must be provided and cannot be empty.');
    }

    const jobData = {
      ...rest,
      poster: {
        connect: { id: posterId },
      },
      categories: {
        connect: createJobDto.categories.map((name) => ({ name })),
      },
    };
  
    return this.prisma.job.create({
      data: jobData,
    });
  }

  async findAll(): Promise<Job[]> {
    try {
      return await this.prisma.job.findMany({
        include: {
          categories: true, // Include categories in the response
        },
      });
    } catch (error) {
      throw new Error(`Could not fetch jobs: ${error.message}`);
    }
  }

  async findAllCategories(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany();
    } catch (error) {
      throw new Error(`Could not fetch jobs: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Job> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id },
        include: { poster: true, offers: true, conversations: true, categories: true, },
      });

      if (!job) {
        throw new NotFoundException(`Job with ID ${id} not found`);
      }

      return job;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Could not fetch job: ${error.message}`);
    }
  }

  async update(id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    try {
      return await this.prisma.job.update({
        where: { id },
        data: updateJobDto,
      });
    } catch (error) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }

  async remove(id: number): Promise<Job> {
    try {
      return await this.prisma.job.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }

  async getJobsByUser(userId: number): Promise<Job[]> {
    try {
      return await this.prisma.job.findMany({
        where: { posterId: userId },
        include: {
          categories: true, // Include categories in the response
        },
      });
    } catch (error) {
      throw new Error(`Could not fetch jobs for user: ${error.message}`);
    }
  }

  async getJobsWithOffers(): Promise<Job[]> {
    try {
      return await this.prisma.job.findMany({
        include: {
          offers: true,
          categories: true,
        },
      });
    } catch (error) {
      throw new Error(`Could not fetch jobs with offers: ${error.message}`);
    }
  }

  async createJobCategories() {
    const categories = [
      "ai analyst", "backend", "bitcoin", "blockchain", "community manager", "crypto",
      "cryptography", "cto", "customer support", "dao", "data science", "defi", "design",
      "developer relations", "devops", "discord", "economy designer", "entry level", "erc",
      "erc 20", "evm", "front end", "full stack", "game dev", "ganache", "golang", "hardhat",
      "intern", "java", "javascript", "layer 2", "marketing", "mobile", "moderator", "nft",
      "node", "non tech", "open source", "openzeppelin", "pay in crypto", "product manager",
      "project manager", "react", "refi", "research", "ruby", "rust", "sales", "smart contract",
      "solana", "solidity", "truffle", "web3 py", "web3js", "zero knowledge"
    ];
  
    // Fetch existing categories from the database
    const existingCategories = await this.prisma.category.findMany({
      select: { name: true },
    });
  
    // Extract names of existing categories
    const existingCategoryNames = existingCategories.map((category) => category.name);
  
    // Filter categories that are not already in the database
    const newCategories = categories.filter(
      (category) => !existingCategoryNames.includes(category)
    );
  
    // Bulk create new categories
    if (newCategories.length > 0) {
      await this.prisma.category.createMany({
        data: newCategories.map((name) => ({ name })),
        skipDuplicates: true, // Skip duplicates for extra safety
      });
    }
  
    Logger.log(`Added ${newCategories.length} new categories.`);
  }

  async getCompletedJobsByFreelancerTelegramId(telegramId: bigint) {
    try {
      return await this.prisma.job.findMany({
        where: {
          offers: {
            some: {
              freelancer: {
                telegramId,
              },
              status: 'COMPLETED', // Assuming you have a `status` field in `Offer` indicating completion
            },
          },
        },
        include: {
          categories: true, // Include categories if needed
          poster: {
            select: { id: true, firstName: true, lastName: true }, // Include specific poster fields
          },
        },
      });
    } catch (error) {
      throw new Error(`Error fetching completed jobs: ${error.message}`);
    }
  }
}
