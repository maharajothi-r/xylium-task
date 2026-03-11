import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';


@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notificationQueue') private queue: Queue,
  ) {}

  async addEmailJob(data: any) {

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

      jobIds.push(job.id);

    }

    return {
      message: "Email jobs added to queue",
      jobIds: jobIds,
    };
  }

 

  // async addRepeatJob() {
  //   await this.queue.add(
  //     'repeatEmail',
  //     { message: 'Scheduled Notification' },
  //     {
  //       repeat: {
  //         every: 300000,
  //       },
  //     },
  //   );

  //   return {
  //     message: "Repeat job added (runs every 5 minutes)"
  //   };
  // }

}

