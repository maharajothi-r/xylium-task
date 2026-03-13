import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { BullModule } from '@nestjs/bullmq';
import { NotificationWorker } from './notification.worker';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notificationQueue',
    }),

    BullBoardModule.forFeature({
      name: 'notificationQueue',
      adapter: BullMQAdapter,
    }),
  ],
  providers: [NotificationService, NotificationWorker],
  controllers: [NotificationController],
})
export class NotificationModule {}
