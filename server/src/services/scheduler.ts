import { Task } from '../models/Task';
import { sendNotification } from './socketService';
import { sendTaskReminderEmail } from './emailService';
import { IUser } from '../models/User';

export const startScheduler = () => {
    console.log('Task Deadline Scheduler started...');

    setInterval(async () => {
        try {
            const now = new Date();
            const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000);

            const tasks = await Task.find({
                deadline: {
                    $gt: now,
                    $lte: fifteenMinutesLater
                },
                status: 'pending',
                notificationSent: { $ne: true }
            }).populate('user');

            for (const task of tasks) {
                const user = task.user as unknown as IUser;
                const userId = user._id.toString();

                console.log(`Sending reminder for task ${task.title} to user ${userId} (${user.email})`);


                sendNotification(userId, 'task-reminder', {
                    taskId: task._id,
                    title: task.title,
                    deadline: task.deadline,
                    message: `Reminder: Task "${task.title}" is due in less than 15 minutes!`
                });


                if (user.email) {
                    await sendTaskReminderEmail(user.email, task.title, task.deadline!);
                }

                task.notificationSent = true;
                await task.save();
            }
        } catch (error) {
            console.error('Scheduler error:', error);
        }
    }, 60 * 1000);
};
