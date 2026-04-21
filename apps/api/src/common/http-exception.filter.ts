import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const res = exception.getResponse();

    let code = 'UNKNOWN_ERROR';
    let message = '发生未知错误';

    if (typeof res === 'string') {
      message = res;
    } else if (typeof res === 'object' && res !== null) {
      const obj = res as Record<string, any>;
      if (typeof obj.message === 'string') {
        message = obj.message;
      } else if (Array.isArray(obj.message)) {
        message = obj.message.join(', ');
      }
      if (typeof obj.error === 'string') {
        code = obj.error;
      }
    }

    // Avoid leaking stack traces or internal details in production
    const isDev = process.env.NODE_ENV !== 'production';

    response.status(status).json({
      error: {
        code,
        message,
        ...(isDev && exception.stack ? { stack: exception.stack } : {}),
      },
    });
  }
}
