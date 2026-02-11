import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    // If already connected, skip
    if (isConnected) {
        console.log('✓ Using existing MongoDB connection');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
        console.log(`✓ Database: ${conn.connection.name}`);

    } catch (error) {
        console.error(`\n⚠️  MongoDB Connection Failed: ${error.message}`);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('⚠️  Operating in FALLBACK MODE (No Database)');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('\n📋 Available Options:\n');
        console.error('  1. Use Mobile Hotspot (bypass corporate firewall)');
        console.error('  2. Check MongoDB Atlas cluster status at cloud.mongodb.com');
        console.error('  3. Add your IP to Network Access whitelist in Atlas');
        console.error('  4. Contact IT to allow port 27017 outbound\n');
        console.error('🔄 Server will continue running with limited functionality...\n');

        // Don't exit - allow server to run without DB
        isConnected = false;
    }
};

// Export connection status checker
export const isDatabaseConnected = () => isConnected;

export default connectDB;
