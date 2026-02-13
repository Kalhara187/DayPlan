import User from '../models/User.js';
import { sendTestNotification } from '../services/emailService.js';

// Sample user for testing when database is not connected
const SAMPLE_USER = {
    id: 'sample-user-12345',
    _id: 'sample-user-12345',
    fullName: 'Sample User',
    email: 'dayplan1234@gmail.com',
    emailNotifications: false,
    notificationTime: '09:00',
    notificationEmail: 'dayplan1234@gmail.com'
};

// Get notification settings
export const getNotificationSettings = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.userId;

        // Check if it's the sample user
        if (userId === SAMPLE_USER.id) {
            return res.status(200).json({
                status: 'success',
                data: {
                    emailNotifications: SAMPLE_USER.emailNotifications,
                    notificationTime: SAMPLE_USER.notificationTime,
                    notificationEmail: SAMPLE_USER.notificationEmail
                }
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                emailNotifications: user.emailNotifications,
                notificationTime: user.notificationTime,
                notificationEmail: user.notificationEmail || user.email
            }
        });
    } catch (error) {
        console.error('Error fetching notification settings:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch notification settings'
        });
    }
};

// Update notification settings
export const updateNotificationSettings = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.userId;
        const { emailNotifications, notificationTime, notificationEmail } = req.body;

        // Check if it's the sample user
        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot modify sample user notification settings'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Update fields if provided
        if (emailNotifications !== undefined) {
            user.emailNotifications = emailNotifications;
        }
        if (notificationTime) {
            user.notificationTime = notificationTime;
        }
        if (notificationEmail) {
            user.notificationEmail = notificationEmail;
        }

        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Notification settings updated successfully',
            data: {
                emailNotifications: user.emailNotifications,
                notificationTime: user.notificationTime,
                notificationEmail: user.notificationEmail || user.email
            }
        });
    } catch (error) {
        console.error('Error updating notification settings:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update notification settings'
        });
    }
};

// Send test notification
export const sendTestEmail = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.userId;

        // Check if it's the sample user
        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot send test email for sample user'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const emailToSend = user.notificationEmail || user.email;

        await sendTestNotification(emailToSend, user.fullName);

        res.status(200).json({
            status: 'success',
            message: 'Test email sent successfully',
            data: {
                sentTo: emailToSend
            }
        });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to send test email. Please check your email configuration.'
        });
    }
};
