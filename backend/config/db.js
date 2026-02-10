import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.error('\n⚠️  Connection Failed! Check the following:');

        if (error.message.includes('querySrv ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
            console.error('❌ DNS Resolution Error - Cannot resolve MongoDB Atlas hostname');
            console.error('   Solutions:');
            console.error('   1. Check if MongoDB Atlas cluster is running (not paused)');
            console.error('   2. Verify your internet connection');
            console.error('   3. Try flushing DNS cache: ipconfig /flushdns');
            console.error('   4. Check if VPN/Firewall is blocking connection');
            console.error('   5. Try using a standard connection string instead of mongodb+srv://');
        } else if (error.message.includes('Authentication failed')) {
            console.error('❌ Authentication Failed - Check username and password in .env');
        } else if (error.message.includes('MongoServerSelectionError')) {
            console.error('❌ Server Selection Error - MongoDB Atlas cluster may be unreachable');
            console.error('   - Check Network Access IP whitelist in Atlas (add 0.0.0.0/0 for testing)');
        }

        console.error('\n📝 Your connection string:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
        process.exit(1);
    }
};

export default connectDB;
