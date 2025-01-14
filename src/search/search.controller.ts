import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('users')
  @ApiOperation({ summary: 'Search Users by username, name, or description' })
  @ApiQuery({
    name: 'query',
    type: String,
    required: true,
    description: 'Search query string',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of results per page',
  })
  @ApiQuery({
    name: 'userId',
    type: Number,
    required: true,
    description: 'ID of the user performing the search',
  })
  async searchUsers(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('userId') userId: number,
  ) {
    const { results, total } = await this.searchService.searchUsers(
      query,
      page,
      limit,
    );
    await this.searchService.saveRecentSearch(userId, query);
    return { results, total };
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Search Jobs by title or description' })
  @ApiQuery({
    name: 'query',
    type: String,
    required: true,
    description: 'Search query string',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of results per page',
  })
  @ApiQuery({
    name: 'userId',
    type: Number,
    required: true,
    description: 'ID of the user performing the search',
  })
  async searchJobs(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('userId') userId: number,
  ) {
    const { results, total } = await this.searchService.searchJobs(
      query,
      page,
      limit,
    );
    await this.searchService.saveRecentSearch(userId, query);
    return { results, total };
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent searches for a user' })
  @ApiQuery({
    name: 'userId',
    type: Number,
    required: true,
    description: 'ID of the user',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of recent searches to retrieve',
  })
  async getRecentSearches(
    @Query('userId') userId: number,
    @Query('limit') limit = 10,
  ) {
    return await this.searchService.getRecentSearches(userId, limit);
  }
}
