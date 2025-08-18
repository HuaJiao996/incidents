# @incidents/queue

这个包提供了一个基于BullMQ和Bun Redis客户端的队列服务，用于处理异步任务和作业调度。

## 特性

- 使用BullMQ作为队列管理系统
- 使用IORedis作为Redis客户端
- 支持作业调度、重试和错误处理
- 提供简单的API来创建队列、工作者和调度器

## 安装

```bash
bun add @incidents/queue
```

## 使用方法

### 创建队列服务

```typescript
import { QueueService } from '@incidents/queue';

// 使用默认Redis URL (redis://localhost:6379)
const queueService = new QueueService();

// 或者指定Redis URL
const queueService = new QueueService('redis://your-redis-server:6379');
```

### 创建队列

```typescript
const queue = queueService.createQueue({
  name: 'my-queue',
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
```

### 添加作业

```typescript
await queue.add('job-name', { data: 'job data' });
```

### 创建工作者处理作业

```typescript
queueService.createWorker('my-queue', async (job) => {
  console.log(`Processing job ${job.id} with data:`, job.data);
  // 处理作业...
  return { result: 'success' };
}, { concurrency: 5 });
```

### 创建调度器

```typescript
const scheduler = queueService.createScheduler('my-queue');
```

### 关闭服务

```typescript
await queueService.close();
```
