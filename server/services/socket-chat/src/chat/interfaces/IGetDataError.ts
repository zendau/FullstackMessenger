import { HttpStatus } from '@nestjs/common';

export default interface IGetDataError {
  status: boolean;
  message: string;
  httpCode: HttpStatus;
}
