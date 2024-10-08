import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  HttpException,
  Put,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { HttpErrorDTO } from '@/services/auth/ResponseDTO/httpError.dto';
import { FoulderDTO } from '@/services/fileCloud/foulder/dto/foulder.dto';

@ApiBearerAuth()
@ApiTags('FileCloud microservice - Foulder controller')
@UseGuards(JwtAuthGuard)
@Controller('foulder')
export class FoulderController {
  constructor(@Inject('FILE_SERVICE') private fileServiceClient: ClientProxy) {}

  @ApiOperation({ summary: 'Create new foulder' })
  @ApiResponse({ status: 200, type: FoulderDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @UsePipes(ValidationPipe)
  @Post('add')
  async create(@Body() createFoulderDto: FoulderDTO) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/add', createFoulderDto),
    );

    return res;
  }

  @ApiOperation({ summary: 'Get all foulders' })
  @ApiResponse({ status: 200, type: FoulderDTO, isArray: true })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('getAll')
  async findAll() {
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/getAll', ''),
    );

    return res;
  }

  @ApiOperation({ summary: 'Get foulder by id' })
  @ApiResponse({ status: 200, type: FoulderDTO })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Get('get/:id')
  async findOne(@Param('id', ParseIntPipe) foulderId: number) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/get', foulderId),
    );

    return res;
  }

  @ApiOperation({ summary: 'Edit foulder data' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @UsePipes(ValidationPipe)
  @Put('edit')
  async update(@Body() updateFoulderDto: FoulderDTO) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/edit', updateFoulderDto),
    );

    return res;
  }

  @ApiOperation({ summary: 'Delete foulder' })
  @ApiResponse({ status: 200, description: 'Success operation' })
  @ApiResponse({ status: 400, type: HttpErrorDTO })
  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) foulderId: number) {
    const res = await firstValueFrom(
      this.fileServiceClient.send('foulder/delete', foulderId),
    );

    return res;
  }
}
