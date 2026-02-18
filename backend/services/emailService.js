import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000
    });
};

// Send daily task notification
export const sendDailyTaskNotification = async (userEmail, userName, tasks = []) => {
    try {
        const transporter = createTransporter();

        // Build task list HTML
        let taskListHTML = '';
        if (tasks.length > 0) {
            taskListHTML = tasks.map(task => {
                const priorityColors = {
                    high: '#dc2626',
                    medium: '#f59e0b',
                    low: '#10b981'
                };
                const priorityColor = priorityColors[task.priority] || priorityColors.medium;
                
                return `
                    <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid ${priorityColor};">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #333; font-size: 16px;">
                                ${task.completed ? '✅' : '⭕'} ${task.title}
                            </span>
                        </div>
                        ${task.description ? `<p style="color: #666; margin: 5px 0; font-size: 14px;">${task.description}</p>` : ''}
                        <div style="display: flex; gap: 15px; color: #888; font-size: 13px; margin-top: 8px;">
                            ${task.startTime ? `<span>🕐 ${task.startTime}${task.endTime ? ` - ${task.endTime}` : ''}</span>` : ''}
                            <span style="color: ${priorityColor}; font-weight: bold;">⬆ ${task.priority.toUpperCase()}</span>
                            ${task.category ? `<span>📁 ${task.category}</span>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            taskListHTML = `
                <div style="background: #e0f7fa; padding: 20px; border-radius: 8px; text-align: center;">
                    <p style="color: #006064; font-size: 16px; margin: 0;">
                        🎉 No tasks scheduled for today! Enjoy your free day or add new tasks.
                    </p>
                </div>
            `;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `📋 Your Daily Tasks Reminder - ${tasks.length} Task${tasks.length !== 1 ? 's' : ''} Today`,
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
                            color: white !important;
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
                        .stats {
                            display: flex;
                            justify-content: space-around;
                            margin: 20px 0;
                        }
                        .stat-box {
                            background: white;
                            padding: 15px;
                            border-radius: 8px;
                            text-align: center;
                            flex: 1;
                            margin: 0 5px;
                        }
                        .stat-number {
                            font-size: 24px;
                            font-weight: bold;
                            color: #667eea;
                        }
                        .stat-label {
                            font-size: 12px;
                            color: #666;
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
                        <p>Here's your task summary for today:</p>
                        
                        <div class="stats">
                            <div class="stat-box">
                                <div class="stat-number">${tasks.length}</div>
                                <div class="stat-label">Total Tasks</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-number">${tasks.filter(t => t.completed).length}</div>
                                <div class="stat-label">Completed</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-number">${tasks.filter(t => !t.completed).length}</div>
                                <div class="stat-label">Pending</div>
                            </div>
                        </div>

                        <div class="task-reminder">
                            <h3>🎯 Today's Tasks</h3>
                            ${taskListHTML}
                        </div>

                        <p>Ready to tackle your day? Click below to view your tasks:</p>
                        <center>
                            <a href="${process.env.FRONTEND_URL}/dayplan" class="cta-button">View My Tasks</a>
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
        console.error('Error sending daily notification email:', error.message);
        console.error('Error details:', error);
        throw error;
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

// Send password reset email
export const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
    try {
        const transporter = createTransporter();
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: '🔐 Password Reset Request - DayPlan',
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
                        .reset-box {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .cta-button {
                            display: inline-block;
                            background: #667eea;
                            color: white !important;
                            padding: 14px 35px;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
                            font-weight: bold;
                        }
                        .warning {
                            background: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
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
                        <h1>🔐 Password Reset Request</h1>
                        <p>DayPlan Security</p>
                    </div>
                    <div class="content">
                        <h2>Hello, ${userName}!</h2>
                        <p>We received a request to reset your password for your DayPlan account.</p>
                        
                        <div class="reset-box">
                            <h3>Reset Your Password</h3>
                            <p>Click the button below to create a new password:</p>
                            <center>
                                <a href="${resetUrl}" class="cta-button">Reset Password</a>
                            </center>
                            <p style="font-size: 12px; color: #6c757d; margin-top: 15px;">
                                Or copy and paste this link into your browser:<br>
                                <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
                            </p>
                        </div>

                        <div class="warning">
                            <strong>⏰ Important:</strong> This link will expire in 1 hour for security reasons.
                        </div>

                        <p><strong>Didn't request this?</strong></p>
                        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns. Your password will remain unchanged.</p>

                        <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
                            🔒 For security, never share this email or link with anyone.
                        </p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email from DayPlan.</p>
                        <p>© 2026 DayPlan. All rights reserved.</p>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

// Send password reset confirmation email
export const sendPasswordResetConfirmation = async (userEmail, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: '✅ Password Successfully Reset - DayPlan',
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
                            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
                        .success-box {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            text-align: center;
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
                        <h1>✅ Password Reset Successful</h1>
                        <p>DayPlan Security</p>
                    </div>
                    <div class="content">
                        <h2>Hello, ${userName}!</h2>
                        
                        <div class="success-box">
                            <h3>✓ Your password has been successfully reset</h3>
                            <p>You can now sign in to your DayPlan account with your new password.</p>
                        </div>

                        <p><strong>Didn't make this change?</strong></p>
                        <p>If you didn't reset your password, please contact our support team immediately to secure your account.</p>

                        <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
                            🔒 Always keep your password secure and don't share it with anyone.
                        </p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email from DayPlan.</p>
                        <p>© 2026 DayPlan. All rights reserved.</p>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset confirmation email sent successfully:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending password reset confirmation email:', error);
        throw new Error('Failed to send password reset confirmation email');
    }
};

// Send task creation confirmation email
export const sendTaskCreatedEmail = async (userEmail, userName, taskDetails) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: '✅ New Task Added - DayPlan',
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
                        .task-card {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 20px 0;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            border-left: 4px solid #667eea;
                        }
                        .task-title {
                            font-size: 18px;
                            font-weight: bold;
                            color: #667eea;
                            margin-bottom: 10px;
                        }
                        .task-detail {
                            margin: 8px 0;
                            font-size: 14px;
                        }
                        .priority-badge {
                            display: inline-block;
                            padding: 4px 12px;
                            border-radius: 12px;
                            font-size: 12px;
                            font-weight: bold;
                        }
                        .priority-high { background: #fee; color: #c00; }
                        .priority-medium { background: #ffe; color: #c90; }
                        .priority-low { background: #efe; color: #0a0; }
                        .cta-button {
                            display: inline-block;
                            background: #667eea;
                            color: white !important;
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
                        <h1>✅ New Task Created</h1>
                        <p>Task added to your DayPlan</p>
                    </div>
                    <div class="content">
                        <h2>Hello, ${userName}!</h2>
                        <p>You've successfully created a new task:</p>
                        
                        <div class="task-card">
                            <div class="task-title">${taskDetails.title}</div>
                            ${taskDetails.description ? `<p style="color: #666; margin: 10px 0;">${taskDetails.description}</p>` : ''}
                            <div class="task-detail">
                                <strong>📅 Date:</strong> ${taskDetails.date}
                            </div>
                            ${taskDetails.startTime ? `
                                <div class="task-detail">
                                    <strong>🕐 Time:</strong> ${taskDetails.startTime}${taskDetails.endTime ? ` - ${taskDetails.endTime}` : ''}
                                </div>
                            ` : ''}
                            <div class="task-detail">
                                <strong>Priority:</strong> 
                                <span class="priority-badge priority-${taskDetails.priority || 'medium'}">
                                    ${(taskDetails.priority || 'medium').toUpperCase()}
                                </span>
                            </div>
                            ${taskDetails.category ? `
                                <div class="task-detail">
                                    <strong>Category:</strong> ${taskDetails.category}
                                </div>
                            ` : ''}
                        </div>

                        <center>
                            <a href="${process.env.FRONTEND_URL}/dayplan" class="cta-button">View All Tasks</a>
                        </center>

                        <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
                            💡 <strong>Tip:</strong> Stay organized and check off tasks as you complete them!
                        </p>
                    </div>
                    <div class="footer">
                        <p>You're receiving this email because you created a task in DayPlan.</p>
                        <p>© 2026 DayPlan. All rights reserved.</p>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Task creation email sent successfully:', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending task creation email:', error);
        throw new Error('Failed to send task creation email');
    }
};

