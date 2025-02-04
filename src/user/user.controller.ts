import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ok, badRequest } from './utils/http-utils';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendConnectionRequestDto } from './dto/send-connection-request.dto';
import { UpdateConnectionRequestDto } from './dto/update-connection-request.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('leaderboards')
  @ApiOperation({ summary: 'Get paginated leaderboard of top referrers' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of users sorted by referral count (desc)',
  })
  async getLeaderboard(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.userService.getReferralsLeaderboard(pageNumber, limitNumber);
  }

  @Post('create-user')
  @ApiOperation({ summary: 'Create User' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      return ok(user);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Put('update-user/:id')
  @ApiOperation({ summary: 'Update User by ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User Not Found' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.updateUserById(
        parseInt(id),
        updateUserDto,
      );
      return ok(user);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Delete('delete-user/:id')
  @ApiOperation({ summary: 'Delete User by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    try {
      const user = await this.userService.remove(parseInt(id));
      return ok(user);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get('all-users')
  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({ status: 200, description: 'All users retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No users found' })
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      return ok(users);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get('top-ranked')
  @ApiOperation({ summary: 'Get Top Ranked Users' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getTopRankedUsers() {
    try {
      // Use BigInt instead of parseInt
      const users = await this.userService.getTopRankedUsers();
      return users;
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get('get-user/referrerInviteLink/:referrerInviteLink')
  @ApiOperation({ summary: 'Get User by referrerInviteLink ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserRefferalId(@Param('referrerInviteLink') referrerInviteLink: string) {
    try {
      // Use BigInt instead of parseInt
      const user = await this.userService.getUserByReferrerInviteLink(referrerInviteLink);
      return ok(user);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }


 

  @Get('/get-user/:userId')
  @ApiOperation({ summary: 'Get User by User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('userId') userId: string) {
    try {
      // Use BigInt instead of parseInt
      const user = await this.userService.getUserById(userId);
      return ok(user);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }


  @Post('heartbeat')
  @ApiOperation({ summary: 'User Heartbeat' })
  @ApiBody({ type: HeartbeatDto })
  @ApiResponse({ status: 200, description: 'Heartbeat received successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async heartbeat(@Body() heartbeatDto: HeartbeatDto) {
    try {
      const user = await this.userService.updateUserHeartbeat(
        heartbeatDto.userId,
      );
      return ok(user);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get(':telegramId')
  @ApiOperation({ summary: 'Get User by Telegram ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByTelegramId(@Param('telegramId') telegramId: string) {
    console.log('telegramId00000', telegramId);
    try {
      const user = await this.userService.getUserByTelegramId(telegramId);
      return ok(user);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  
  @Post('upload-photo/:userId')
  @ApiOperation({ summary: 'Upload user profile photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Photo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or upload failed' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = await this.userService.uploadUserPhoto(
        parseInt(userId),
        file.buffer,
        file.mimetype,
        file.originalname,
      );
      return ok(user);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get(':userId/referrer-rank')
  async getReferrerRank(@Param('userId') userId: string) {
    const referrerRank = await this.userService.getReferrerRank(
      parseInt(userId),
    );
    if (referrerRank) {
      return {
        referrerName: referrerRank.username,
        rank: referrerRank.rank,
      };
    } else {
      return {
        message: "You weren't invited by anyone or the user doesn't exist",
      };
    }
  }

  @Post('connection-request')
  @ApiOperation({ summary: 'Send Connection Request' })
  @ApiBody({ type: SendConnectionRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Connection request sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or request exists' })
  async sendConnectionRequest(
    @Body() sendConnectionRequestDto: SendConnectionRequestDto,
  ) {
    try {
      const request = await this.userService.sendConnectionRequest(
        sendConnectionRequestDto,
      );
      return ok(request);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Put('connection-request/:requestId')
  @ApiOperation({ summary: 'Accept or Reject Connection Request' })
  @ApiBody({ type: UpdateConnectionRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Connection request updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async handleConnectionRequest(
    @Param('requestId') requestId: string,
    @Body() updateConnectionRequestDto: UpdateConnectionRequestDto,
  ) {
    try {
      const request = await this.userService.handleConnectionRequest(
        parseInt(requestId),
        updateConnectionRequestDto,
      );
      return ok(request);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get(':telegramId/connections')
  @ApiOperation({ summary: 'Get User Connections' })
  @ApiResponse({
    status: 200,
    description: 'Connections retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserConnections(@Param('telegramId') telegramId: string) {
    try {
      const connections = await this.userService.getUserConnections(telegramId);
      return ok(connections);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get(':userId/pending-requests')
  @ApiOperation({ summary: 'Get Pending Connection Requests' })
  @ApiResponse({
    status: 200,
    description: 'Pending requests retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getPendingRequests(@Param('userId') userId: string) {
    try {
      const requests = await this.userService.getPendingRequests(
        parseInt(userId),
      );
      return ok(requests);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get User by Username' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByUsername(@Param('username') username: string) {
    try {
      const user = await this.userService.getUserByUsername(username);
      return ok(user);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Post(':userId/follow')
  @ApiOperation({ summary: 'Follow a User' })
  @ApiResponse({
    status: 201,
    description: 'Successfully followed the user',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or already following',
  })
  async followUser(
    @Param('userId') followerId: string,
    @Body('followedId') followedId: number,
  ) {
    try {
      const follow = await this.userService.followUser(
        parseInt(followerId),
        followedId,
      );
      return ok(follow);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Delete(':userId/unfollow')
  @ApiOperation({ summary: 'Unfollow a User' })
  @ApiResponse({
    status: 200,
    description: 'Successfully unfollowed the user',
  })
  @ApiResponse({ status: 404, description: 'Not following this user' })
  async unfollowUser(
    @Param('userId') followerId: string,
    @Body('followedId') followedId: number,
  ) {
    try {
      const unfollow = await this.userService.unfollowUser(
        parseInt(followerId),
        followedId,
      );
      return ok(unfollow);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get(':userId/followers')
  @ApiOperation({ summary: 'Get User Followers' })
  @ApiResponse({
    status: 200,
    description: 'Followers retrieved successfully',
  })
  async getFollowers(@Param('userId') userId: string) {
    try {
      const followers = await this.userService.getFollowers(parseInt(userId));
      return ok(followers);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get(':userId/followings')
  @ApiOperation({ summary: 'Get Users Followed by a User' })
  @ApiResponse({
    status: 200,
    description: 'Followings retrieved successfully',
  })
  async getFollowings(@Param('userId') userId: string) {
    try {
      const followings = await this.userService.getFollowings(parseInt(userId));
      return ok(followings);
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }

  @Get(':userId/is-following/:followedId')
  @ApiOperation({ summary: 'Check if User is Following Another User' })
  @ApiResponse({
    status: 200,
    description: 'Follow status retrieved successfully',
  })
  async isFollowing(
    @Param('userId') followerId: string,
    @Param('followedId') followedId: string,
  ) {
    try {
      const isFollowing = await this.userService.isFollowing(
        parseInt(followerId),
        parseInt(followedId),
      );
      return ok({ isFollowing });
    } catch (error) {
      return badRequest({ message: error.message });
    }
  }
}
