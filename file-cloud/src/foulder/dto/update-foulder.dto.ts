import { PartialType } from '@nestjs/mapped-types';
import { CreateFoulderDto } from './create-foulder.dto';

export class UpdateFoulderDto extends PartialType(CreateFoulderDto) {}
