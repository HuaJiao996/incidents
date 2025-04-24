import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomFieldValidationException extends HttpException {
  constructor(
    public readonly errors: {
      field: string;
      reason: string;
    }[],
    message: string = '字段验证失败',
  ) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: 'Bad Request',
        errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
