import dotenv from 'dotenv';
import { sendTestNotification } from '../services/emailService.js';

dotenv.config();

const testEmail = async () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Testing Email Configuration');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check configuration
    if (!process.env.EMAIL_USER) {
        console.error('❌ EMAIL_USER not set in .env file');
        console.error('\n📝 Add to .env:');
        console.error('EMAIL_USER=your-email@gmail.com\n');
        process.exit(1);
    }

    if (!process.env.EMAIL_PASSWORD) {
        console.error('❌ EMAIL_PASSWORD not set in .env file');
        console.error('\n📝 Add to .env:');
        console.error('EMAIL_PASSWORD=your-app-password\n');
        console.error('📌 Get Gmail App Password: https://myaccount.google.com/apppasswords\n');
        process.exit(1);
    }

    console.log(`✓ Email User: ${process.env.EMAIL_USER}`);
    console.log(`✓ Email Password: ${'*'.repeat(process.env.EMAIL_PASSWORD.length)} (hidden)\n`);

    // Prompt for test email
    const testEmailAddress = process.argv[2] || process.env.EMAIL_USER;
    const testUserName = process.argv[3] || 'Test User';

    console.log(`📤 Sending test email to: ${testEmailAddress}`);
    console.log(`👤 User name: ${testUserName}\n`);

    try {
        await sendTestNotification(testEmailAddress, testUserName);

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Email sent successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📬 Check your inbox (and spam folder)\n');

        process.exit(0);
    } catch (error) {
        console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ Email sending failed!');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.error('Error:', error.message);

        console.log('\n🔧 Troubleshooting:');
        console.log('  1. Verify EMAIL_USER and EMAIL_PASSWORD in .env');
        console.log('  2. For Gmail, use App Password (not regular password)');
        console.log('  3. Generate at: https://myaccount.google.com/apppasswords');
        console.log('  4. Check if 2-factor authentication is enabled');
        console.log('  5. Try different email service (Outlook, Yahoo)\n');

        process.exit(1);
    }
};

console.log('\n🚀 DayPlan Email Test Utility');
console.log('Usage: node scripts/testEmail.js [email] [name]\n');

testEmail();
