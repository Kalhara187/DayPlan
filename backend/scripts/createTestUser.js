import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Create test user
const createTestUser = async () => {
    try {
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'abc@gmail.com' });

        if (existingUser) {
            console.log('User already exists!');
            console.log('Email: abc@gmail.com');
            console.log('Password: 123456');
            process.exit(0);
        }

        // Create new user
        const user = await User.create({
            fullName: 'Test User',
            email: 'abc@gmail.com',
            password: '123456'
        });

        console.log('✅ Test user created successfully!');
        console.log('Email: abc@gmail.com');
        console.log('Password: 123456');
        console.log('User ID:', user._id);

        process.exit(0);
    } catch (error) {
        console.error('Error creating user:', error.message);
        process.exit(1);
    }
};

createTestUser();
