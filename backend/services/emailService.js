import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // You can change this to any email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send daily task notification
export const sendDailyTaskNotification = async (userEmail, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: '📋 Your Daily Tasks Reminder - DayPlan',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            border-radius: 10px 10px 0 0;
                            text-align: center;
                        }
                        .content {
                            background: #f8f9fa;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .task-reminder {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .cta-button {
                            display: inline-block;
                            background: #667eea;
                            color: white;
                            padding: 12px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            color: #6c757d;
                            font-size: 12px;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>📋 Daily Task Reminder</h1>
                        <p>Stay organized and productive!</p>
                    </div>
                    <div class="content">
                        <h2>Hello, ${userName}!</h2>
                        <p>This is your friendly reminder to check your daily tasks.</p>
                        
                        <div class="task-reminder">
                            <h3>🎯 Today's Focus</h3>
                            <p>Don't forget to:</p>
                            <ul>
                                <li>Review your tasks for today</li>
                                <li>Prioritize your most important tasks</li>
                                <li>Update completed tasks</li>
                                <li>Plan for tomorrow</li>
                            </ul>
                        </div>

                        <p>Ready to tackle your day? Click below to view your tasks:</p>
                        <center>
                            <a href="http://localhost:5173/home" class="cta-button">View My Tasks</a>
                        </center>

                        <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
                            💡 <strong>Tip:</strong> Break down large tasks into smaller, manageable steps for better productivity!
                        </p>
                    </div>
                    <div class="footer">
                        <p>You're receiving this email because you enabled daily task notifications in DayPlan.</p>
                        <p>To change your notification preferences, visit your settings page.</p>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email notification');
    }
};

// Send test notification
export const sendTestNotification = async (userEmail, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: '✅ Test Notification - DayPlan',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        .success-icon {
                            text-align: center;
                            font-size: 48px;
                            margin: 20px 0;
                        }
                        h2 {
                            color: #28a745;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="success-icon">✅</div>
                        <h2>Email Notifications Activated!</h2>
                        <p>Hi ${userName},</p>
                        <p>This is a test email to confirm that your daily task notifications are now active.</p>
                        <p>You'll receive daily reminders at your specified time to help you stay on track with your tasks.</p>
                        <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
                            <strong>DayPlan Team</strong>
                        </p>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Test email sent successfully:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending test email:', error);
        throw new Error('Failed to send test notification');
    }
};
