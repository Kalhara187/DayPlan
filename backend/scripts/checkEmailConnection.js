import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const checkEmailConnection = async () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔧 Email Connection Diagnostic Tool');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check environment variables
    console.log('📋 Checking Configuration:\n');
    
    if (!process.env.EMAIL_USER) {
        console.error('❌ EMAIL_USER not configured');
        process.exit(1);
    } else {
        console.log(`✓ EMAIL_USER: ${process.env.EMAIL_USER}`);
    }

    if (!process.env.EMAIL_PASSWORD) {
        console.error('❌ EMAIL_PASSWORD not configured');
        process.exit(1);
    } else {
        const passLength = process.env.EMAIL_PASSWORD.length;
        const hasSpaces = process.env.EMAIL_PASSWORD.includes(' ');
        console.log(`✓ EMAIL_PASSWORD: ${'*'.repeat(passLength)} (${passLength} characters)`);
        
        if (hasSpaces) {
            console.log('⚠️  WARNING: Password contains spaces! Google App Passwords should not have spaces.');
            console.log('   Remove spaces: "abcd efgh ijkl mnop" → "abcdefghijklmnop"\n');
        }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔌 Testing SMTP Connections:\n');

    const configs = [
        {
            name: 'Gmail SSL (Port 465) - Recommended',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true
        },
        {
            name: 'Gmail TLS (Port 587) - Alternative',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false
        }
    ];

    let successCount = 0;

    for (const config of configs) {
        try {
            console.log(`\n📡 Testing: ${config.name}`);
            console.log(`   Host: ${config.host}:${config.port}`);
            console.log(`   Secure: ${config.secure}`);
            console.log(`   Attempting connection...`);

            const transporter = nodemailer.createTransport({
                ...config,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false,
                    minVersion: 'TLSv1.2'
                },
                connectionTimeout: 10000,
                greetingTimeout: 10000,
                socketTimeout: 10000
            });

            await transporter.verify();
            console.log(`   ✅ SUCCESS - Connection established!`);
            successCount++;
        } catch (error) {
            console.log(`   ❌ FAILED - ${error.message}`);
            
            if (error.code === 'ETIMEDOUT') {
                console.log(`   → Connection timeout - Port may be blocked by firewall`);
            } else if (error.code === 'EAUTH') {
                console.log(`   → Authentication failed - Check EMAIL_USER and EMAIL_PASSWORD`);
            } else if (error.code === 'ESOCKET') {
                console.log(`   → Socket error - Network connectivity issue`);
            }
        }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Test Summary:\n');
    
    if (successCount > 0) {
        console.log(`✅ ${successCount}/${configs.length} configuration(s) working`);
        console.log('\n✓ Email service is properly configured!');
        console.log('✓ You can send test emails now\n');
    } else {
        console.log(`❌ All configurations failed`);
        console.log('\n🔧 Troubleshooting Steps:\n');
        console.log('1. Gmail App Password Issues:');
        console.log('   - Use App Password, not your regular Gmail password');
        console.log('   - Generate at: https://myaccount.google.com/apppasswords');
        console.log('   - Enable 2-factor authentication first');
        console.log('   - Remove all spaces from the password in .env\n');
        
        console.log('2. Network/Firewall Issues:');
        console.log('   - Check if antivirus/firewall is blocking SMTP ports (465, 587)');
        console.log('   - Try disabling antivirus temporarily to test');
        console.log('   - Check if you\'re behind a corporate firewall\n');
        
        console.log('3. Alternative Solutions:');
        console.log('   - Try using a different email service (Outlook, SendGrid)');
        console.log('   - Use a VPN if your ISP blocks SMTP ports');
        console.log('   - Contact your network administrator\n');
    }

    process.exit(successCount > 0 ? 0 : 1);
};

checkEmailConnection();
