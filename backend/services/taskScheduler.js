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

            // Send notification to each user - CRITICAL: Each user gets ONLY their own tasks
            for (const user of users) {
                try {
                    // SECURITY: Ensure email is sent to the correct user's email address
                    const emailToSend = user.notificationEmail || user.email;
                    
                    // Get today's date in YYYY-MM-DD format
                    const today = new Date().toISOString().split('T')[0];
                    
                    // SECURITY: Fetch today's tasks for THIS SPECIFIC USER ONLY
                    // The user: user._id filter ensures data isolation between users
                    const todayTasks = await Task.find({
                        user: user._id,
                        date: today
                    }).sort({ startTime: 1 });
                    
                    // SECURITY: Verify tasks belong to this user before sending
                    const taskUserId = user._id.toString();
                    const invalidTasks = todayTasks.filter(task => task.user.toString() !== taskUserId);
                    if (invalidTasks.length > 0) {
                        console.error(`🚨 SECURITY ALERT: Found ${invalidTasks.length} tasks that don't belong to user ${user.fullName}`);
                        continue; // Skip this user to prevent data leakage
                    }

                    await sendDailyTaskNotification(emailToSend, user.fullName, todayTasks);
                    console.log(`✅ Notification sent to ${user.fullName} at ${emailToSend} (${todayTasks.length} tasks)`);
                } catch (error) {
                    console.error(`❌ Failed to send notification to ${user.fullName}:`, error.message);
                    console.error('Full error:', error);
                }
            }
        } else {
            console.log(`No users scheduled for notification at ${currentTimeString}`);
        }
    } catch (error) {
        console.error('Error in notification scheduler:', error);
    }
};

// Run every minute to check for notifications
// In production, you might want to optimize this based on your needs
cron.schedule('* * * * *', checkAndSendNotifications);

console.log('📧 Task notification scheduler initialized - checking every minute');
console.log(`📧 Scheduler started at ${new Date().toLocaleString()}`);

// Run a test check immediately to verify scheduler is working
setTimeout(async () => {
    console.log('🔍 Running initial scheduler diagnostic...');
    const users = await User.find({ emailNotifications: true });
    console.log(`📊 Found ${users.length} user(s) with email notifications enabled`);
    if (users.length > 0) {
        users.forEach(user => {
            console.log(`  - ${user.fullName} (${user.email}) scheduled for ${user.notificationTime}`);
        });
    }
}, 5000);

// Export for testing purposes
export { checkAndSendNotifications };
