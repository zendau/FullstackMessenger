import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FoulderService } from './foulder.service';
import { CreateFoulderDto } from './dto/create-foulder.dto';
import { UpdateFoulderDto } from './dto/update-foulder.dto';

@Controller('foulder')
export class FoulderController {
  constructor(private readonly foulderService: FoulderService) {}

  @Post()
  create(@Body() createFoulderDto: CreateFoulderDto) {
    return this.foulderService.create(createFoulderDto);
  }

  @Get()
  findAll() {
    return this.foulderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foulderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoulderDto: UpdateFoulderDto) {
    return this.foulderService.update(+id, updateFoulderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foulderService.remove(+id);
  }
}
