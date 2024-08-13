import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status = 500;

    if (exception.isParse) {
      exception.message = JSON.parse(exception.message);
    }

    console.log('exe', exception);

    const data = {} as { message: string; status: number };

    if (exception instanceof HttpException) {
      data.message = exception.message;
      status = exception.getStatus();
    } else if (exception.message && exception.code) {
      data.message = exception.message;
      status = exception.code;
    } else {
      data.message = exception?.message ?? 'Internal server error';
      status = 500;
    }

    data.status = status;

    this.logger.error({
      ...data,
      timestamp: new Date().toISOString(),
      path: request.url,
      stack: exception instanceof Error ? exception.stack : null,
    });

    response.status(status).json(data);
  }
}
