import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const { method, url, body, params, query } = request;
    const userAgent = request.headers['user-agent'] || '';
    const ip = request.ip;

    const now = Date.now();
    this.logger.log(
      `Request Start - ${method} ${url} - IP: ${ip} - UserAgent: ${userAgent}`,
    );

    if (Object.keys(body as {}).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
    }

    if (Object.keys(params as {}).length > 0) {
      this.logger.debug(`Url Params: ${JSON.stringify(params)}`);
    }

    if (Object.keys(query as {}).length > 0) {
      this.logger.debug(`Query: ${JSON.stringify(query)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `Request End - ${method} ${url} - ${responseTime}ms`,
          );
          this.logger.debug(`Response: ${JSON.stringify(data)}`);
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `Request Failed - ${method} ${url} - ${responseTime}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}