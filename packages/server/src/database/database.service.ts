import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import postgres from 'postgres';
import { DatabaseLogger } from './database.logger';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
  };

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.db = drizzle(this.configService.get<string>('DATABASE_URL')!, {
      schema,
      logger: new DatabaseLogger(),
      casing: 'snake_case',
    });
  }

  getClient() {
    return this.db;
  }
}
