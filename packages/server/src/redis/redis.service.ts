import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redisClient: Redis;
    
    constructor(private configService: ConfigService) {
        this.redisClient = new Redis({
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
            password: this.configService.get<string>('REDIS_PASSWORD'),
            db: this.configService.get<number>('REDIS_DB', 0),
            maxRetriesPerRequest: null, // 添加此配置以兼容 BullMQ
            enableReadyCheck: false,    // 建议添加此配置以提高性能
        });
    }
    
    onModuleInit() {
        this.redisClient.on('error', (err) => {
            console.error('Redis connect error:', err);
        });
        
        this.redisClient.on('connect', () => {
            console.log('Redis connected');
        });
    }
    
    async onModuleDestroy() {
        await this.redisClient.quit();
    }
    
    getClient(): Redis {
        return this.redisClient;
    }
    
    // 基本操作方法
    async get(key: string): Promise<string | null> {
        return this.redisClient.get(key);
    }
    
    async set(key: string, value: string, ttl?: number): Promise<'OK'> {
        if (ttl) {
            return this.redisClient.set(key, value, 'EX', ttl);
        }
        return this.redisClient.set(key, value);
    }
    
    async del(key: string): Promise<number> {
        return this.redisClient.del(key);
    }
    
    async exists(key: string): Promise<number> {
        return this.redisClient.exists(key);
    }
    
    async incr(key: string): Promise<number> {
        return this.redisClient.incr(key);
    }
    
    async hset(key: string, field: string, value: string): Promise<number> {
        return this.redisClient.hset(key, field, value);
    }
    
    async hget(key: string, field: string): Promise<string | null> {
        return this.redisClient.hget(key, field);
    }
    
    async hgetall(key: string): Promise<Record<string, string>> {
        return this.redisClient.hgetall(key);
    }
    
    async publish(channel: string, message: string): Promise<number> {
        return this.redisClient.publish(channel, message);
    }
    
    async subscribe(channel: string, callback: (channel: string, message: string) => void): Promise<void> {
        const subscriber = this.redisClient.duplicate();
        await subscriber.subscribe(channel);
        subscriber.on('message', callback);
    }
}
