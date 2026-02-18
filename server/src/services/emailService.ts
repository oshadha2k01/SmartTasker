import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendTaskReminderEmail = async (email: string, taskTitle: string, deadline: Date) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email credentials not set. Skipping email notification.');
            return;
        }

        const mailOptions = {
            from: `"SmartTasker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Reminder: Task "${taskTitle}" is due soon!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                    <h2 style="color: #4f46e5;">Task Reminder</h2>
                    <p>Hello,</p>
                    <p>This is a reminder that your task <strong>"${taskTitle}"</strong> is due soon.</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Deadline:</strong> ${new Date(deadline).toLocaleString()}</p>
                    </div>
                    <p>Please log in to SmartTasker to manage your tasks.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="color: #475569; font-size: 12px;">This is an automated notification from <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="color: #4f46e5; text-decoration: none;">SmartTasker</a>.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
