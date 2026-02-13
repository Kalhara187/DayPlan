import cron from 'node-cron';
import User from '../models/User.js';
import Task from '../models/Task.js';
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
                    
                    // Get today's date in YYYY-MM-DD format
                    const today = new Date().toISOString().split('T')[0];
                    
                    // Fetch today's tasks for this user
                    const todayTasks = await Task.find({
                        user: user._id,
                        date: today
                    }).sort({ startTime: 1 });

                    await sendDailyTaskNotification(emailToSend, user.fullName, todayTasks);
                    console.log(`Notification sent to ${user.fullName} at ${emailToSend} (${todayTasks.length} tasks)`);
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
