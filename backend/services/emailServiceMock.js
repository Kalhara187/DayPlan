import dotenv from 'dotenv';

dotenv.config();

// Mock Email Service - Use this when SMTP is blocked
// All emails will be logged to console instead of actually sent

export const createMockTransporter = () => {
    return {
        sendMail: async (mailOptions) => {
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 MOCK EMAIL SENT (Development Mode)');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`From: ${mailOptions.from}`);
            console.log(`To: ${mailOptions.to}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            
            return {
                messageId: `mock-${Date.now()}@dayplan.local`,
                response: '250 Mock email accepted'
            };
        },
        verify: async () => {
            console.log('✅ Mock email transporter verified');
            return true;
        }
    };
};

// Updated createTransporter that falls back to mock on failure
export const createTransporter = async () => {
    // If USE_MOCK_EMAIL is set, use mock immediately
    if (process.env.USE_MOCK_EMAIL === 'true') {
        console.log('📧 Using MOCK email service (emails will be logged to console)');
        return createMockTransporter();
    }
    
    // Try to import and use real email service
    try {
        const realEmailService = await import('./emailService.js');
        // Try to create real transporter by calling the createTransporter from emailService
        // If it fails, it will throw and we'll catch below
        console.log('📧 Attempting to use real SMTP email service...');
        return await realEmailService.createTransporter();
    } catch (error) {
        console.log('⚠️  Real SMTP failed, falling back to MOCK email service');
        console.log(`   Error: ${error.message}`);
        console.log('   All emails will be logged to console instead\n');
        return createMockTransporter();
    }
};

// Export functions that use the createTransporter automatically
export const sendDailyTaskNotification = async (userEmail, userName, tasks = []) => {
    const transporter = await createTransporter();
    const mailOptions = {
        from: '"DayPlan" <noreply@dayplan.local>',
        to: userEmail,
        subject: `Daily Tasks for ${userName}`,
        text: `You have ${tasks.length} tasks today`,
        html: `<h1>Daily Tasks</h1><p>You have ${tasks.length} tasks today</p>`
    };
    return await transporter.sendMail(mailOptions);
};

export const sendTestNotification = async (userEmail, userName) => {
    const transporter = await createTransporter();
    const mailOptions = {
        from: '"DayPlan" <noreply@dayplan.local>',
        to: userEmail,
        subject: 'Test Notification',
        text: `Hi ${userName}, this is a test notification!`,
        html: `<h2>✅ Test Success!</h2><p>Hi ${userName}, your email notifications are working!</p>`
    };
    return await transporter.sendMail(mailOptions);
};
