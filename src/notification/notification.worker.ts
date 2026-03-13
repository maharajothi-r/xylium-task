import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
interface NotificationMailInterface{
  email:string;
}

@Processor('notificationQueue')
export class NotificationWorker extends WorkerHost {
  async process(job: Job<NotificationMailInterface>): Promise<any> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      console.log('Processing job', job.id);

      await job.updateProgress(25);

      console.log('Preparing email...');

      await job.updateProgress(50);

      console.log('Sending email to', job.data.email);

      await job.updateProgress(100);

      console.log('Email sent successfully');

      return true;
    } catch (error) {
      console.log('Job failed', error);

      throw error;
    }
  }
}
