import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { DetailedRpcException } from './RpcMetadataException';
import { throwError as _throw } from 'rxjs';

@Catch(DetailedRpcException)
export class DetailedRpcExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(DetailedRpcExceptionsFilter.name);

  catch(exception: DetailedRpcException, host: ArgumentsHost) {
    const error = exception.getError();

    this.logger.error({
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
      stack: exception instanceof Error ? exception.stack : null,
    });

    return _throw(() => error);
  }
}
