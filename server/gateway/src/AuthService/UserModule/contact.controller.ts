import { GetUserDTO } from './../ResponseDTO/getUser.dto';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { firstValueFrom } from 'rxjs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpErrorDTO } from '../ResponseDTO/httpError.dto';
import { ContactDTO } from '../ResponseDTO/contact.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';

@ApiBearerAuth()
@ApiTags('Auth microservice - Contact controller')
@Controller('contact')
export class ContactController {
  constructor(@Inject('AUTH_SERVICE') private authServiceClient: ClientProxy) {}

  @ApiOperation({ summary: 'Get contact list' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  //@UseGuards(JwtAuthGuard)
  @Get('list/:userId')
  async getUserContactList(@Param('userId', ParseIntPipe) userId: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/list', userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Get users list who are not added to contacts' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  //@UseGuards(JwtAuthGuard)
  @Get('freeList/:userId')
  async getFreeUserList(@Param('userId', ParseIntPipe) userId: number) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/freeList', userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Send contact request to user' })
  @ApiResponse({
    status: 200,
    description: 'success sended requests',
  })
  @ApiResponse({
    status: 400,
    description: 'error when adding to contacts',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  //@UseGuards(JwtAuthGuard)
  @Post('sendRequest')
  async sendContactRequest(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/sendRequest', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Get users pending requests' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  //@UseGuards(JwtAuthGuard)
  @Get('pending/:userId')
  async getContactsRequestPending(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/pending', userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Get users outgoing requests' })
  @ApiResponse({
    status: 200,
    type: GetUserDTO,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    type: HttpErrorDTO,
  })
  //@UseGuards(JwtAuthGuard)
  @Get('outgoing/:userId')
  async getContactsRequestOutgoing(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/outgoing', userId),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Confirm contact request' })
  @ApiResponse({
    status: 200,
    description: 'success confirm request',
  })
  @ApiResponse({
    status: 400,
    description: 'error when confirming request',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  //@UseGuards(JwtAuthGuard)
  @Post('confirm')
  async confirmUserRequest(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/confirm', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Reject contact request' })
  @ApiResponse({
    status: 200,
    description: 'success reject request',
  })
  @ApiResponse({
    status: 400,
    description: 'error when rejecting request',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  //@UseGuards(JwtAuthGuard)
  @Post('reject')
  async rejectUserRequest(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/reject', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Delete user from contact' })
  @ApiResponse({
    status: 200,
    description: 'success deleted user operation',
  })
  @ApiResponse({
    status: 400,
    description: 'error when deleting user',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  //@UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteUserFromContact(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/delete', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @ApiOperation({ summary: 'Block selected user' })
  @ApiResponse({
    status: 200,
    description: 'success blocking user',
  })
  @ApiResponse({
    status: 400,
    description: 'error when blocking user',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  //@UseGuards(JwtAuthGuard)
  @Patch('block')
  async blockUserContact(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/block', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }

  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'unblock selected user' })
  @ApiResponse({
    status: 200,
    description: 'success unblock user',
  })
  @ApiResponse({
    status: 400,
    description: 'error when unblocing user',
    type: HttpErrorDTO,
  })
  @UsePipes(ValidationPipe)
  //@UseGuards(JwtAuthGuard)
  @Patch('unBlock')
  async unBlockUserContact(@Body() requestData: ContactDTO) {
    const resData = await firstValueFrom(
      this.authServiceClient.send('contact/unBlock', requestData),
    );
    if (resData.status === false) {
      throw new HttpException(resData.message, resData.httpCode);
    }

    return resData;
  }
}
