import { Controller, Post, Body, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendEmail(@Body() body: CreateNotificationDto) {
    return this.notificationService.addEmailJob(body);
  }
  @Get('redis-data')
  async getRedisData() {
    const data = await this.notificationService.get('emailJob:1');
    console.log(data);
    return data;
  }
}
