import { Logger } from '@nestjs/common';
import { Logger as DrizzleLogger } from 'drizzle-orm';

export class DatabaseLogger implements DrizzleLogger {
  private readonly logger = new Logger(DatabaseLogger.name);
  logQuery(query: string, params: unknown[]): void {
    this.logger.debug({ query, params });
  }
}
