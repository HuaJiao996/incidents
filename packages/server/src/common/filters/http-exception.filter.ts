import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CustomFieldValidationException } from '../exceptions/custom-field-validation.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    // 处理自定义字段验证异常
    if (exception instanceof CustomFieldValidationException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      return response.code(status).send({
        statusCode: status,
        message: exceptionResponse.message,
        error: exceptionResponse.error,
        errors: exceptionResponse.errors,
      });
    }

    // 处理其他 HTTP 异常
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        return response.code(status).send(exceptionResponse);
      }

      return response.code(status).send({
        statusCode: status,
        message: exceptionResponse,
      });
    }

    // 处理未知异常
    console.error(exception);
    return response.code(HttpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '服务器内部错误',
    });
  }
}
