import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Category, Job } from '@prisma/client';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job' })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({
    status: 201,
    description: 'The job has been successfully created.',
  })
  async create(@Body() createJobDto: CreateJobDto): Promise<Job> {
    return await this.jobsService.create(createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'Return all jobs.' })
  async findAll(): Promise<Job[]> {
    return await this.jobsService.findAll();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories.' })
  async findAllCategories(): Promise<Category[]> {
    return await this.jobsService.findAllCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job by id' })
  @ApiResponse({ status: 200, description: 'Return the job.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  async findOne(@Param('id') id: string): Promise<Job> {
    return await this.jobsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a job' })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({
    status: 200,
    description: 'The job has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    return await this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job' })
  @ApiResponse({
    status: 200,
    description: 'The job has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  async remove(@Param('id') id: string): Promise<Job> {
    return await this.jobsService.remove(+id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all jobs posted by a user' })
  @ApiResponse({
    status: 200,
    description: 'Return all jobs posted by the user.',
  })
  async getJobsByUser(@Param('userId') userId: string): Promise<Job[]> {
    return await this.jobsService.getJobsByUser(+userId);
  }

  @Get('with-offers')
  @ApiOperation({ summary: 'Get all jobs with their offers' })
  @ApiResponse({
    status: 200,
    description: 'Return all jobs with their offers.',
  })
  async getJobsWithOffers(): Promise<Job[]> {
    return await this.jobsService.getJobsWithOffers();
  }

  @Get('completed/:telegramId')
  @ApiOperation({ summary: 'Get all jobs completed by a freelancer based on telegramId' })
  @ApiResponse({
    status: 200,
    description: 'Return all jobs completed by a freelancer.',
  })
  async getCompletedJobsByFreelancerTelegramId(
    @Param('telegramId') telegramId: string, // Use string as the type since `BigInt` cannot be directly passed in URLs
  ) {
    try {
      const jobs = await this.jobsService.getCompletedJobsByFreelancerTelegramId(BigInt(telegramId));
      return {
        success: true,
        data: jobs,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
