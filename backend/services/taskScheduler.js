import cron from 'node-cron';
import User from '../models/User.js';
import { sendDailyTaskNotification } from './emailService.js';

// Function to check and send notifications
const checkAndSendNotifications = async () => {
    try {
        const currentTime = new Date();
        const currentHour = currentTime.getHours().toString().padStart(2, '0');
        const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
        const currentTimeString = `${currentHour}:${currentMinute}`;

        console.log(`Checking for notifications at ${currentTimeString}...`);

        // Find all users who have enabled email notifications and match the current time
        const users = await User.find({
            emailNotifications: true,
            notificationTime: currentTimeString
        });

        if (users.length > 0) {
            console.log(`Found ${users.length} user(s) to notify at ${currentTimeString}`);

            // Send notification to each user
            for (const user of users) {
                try {
                    const emailToSend = user.notificationEmail || user.email;
                    await sendDailyTaskNotification(emailToSend, user.fullName);
                    console.log(`Notification sent to ${user.fullName} at ${emailToSend}`);
                } catch (error) {
                    console.error(`Failed to send notification to ${user.fullName}:`, error.message);
                }
            }
        }
    } catch (error) {
        console.error('Error in notification scheduler:', error);
    }
};

// Run every minute to check for notifications
// In production, you might want to optimize this based on your needs
cron.schedule('* * * * *', checkAndSendNotifications);

console.log('📧 Task notification scheduler initialized - checking every minute');

// Export for testing purposes
export { checkAndSendNotifications };
