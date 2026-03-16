import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateNotificationDto } from './notification.dto';
import Redis from 'ioredis';

@Injectable()
export class NotificationService {
  private redis = new Redis();
  constructor(@InjectQueue('notificationQueue') private queue: Queue) {}

  async set(key: string, value: any) {
    await this.redis.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<unknown> {
    const data = await this.redis.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as unknown;
  }

  async addEmailJob(data: CreateNotificationDto) {
    const jobIds: any[] = [];

    for (const email of data.emails) {
      const job = await this.queue.add(
        'sendEmail',
        {
          email: email,
          subject: data.subject,
          message: data.message,
        },
        {
          attempts: 3,
          delay: 5000,
          priority: 2,
          // removeOnComplete: true,
          // removeOnFail: false,
        },
      );

      await this.set(`emailJob:${job.id}`, {
      email: email,
      subject: data.subject,
      message: data.message,
      status: "queued"
    });

      const redisData = await this.get(`emailJob:${job.id}`);
      console.log(redisData);

      jobIds.push(job.id);
    }

    return {
      message: 'Email jobs added to queue',
      jobIds: jobIds,
    };
  }
}
