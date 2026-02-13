import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

// Sample user for testing when database is not connected
const SAMPLE_USER = {
    id: 'sample-user-12345',
    fullName: 'Sample User',
    email: 'dayplan1234@gmail.com',
    password: 'Dayplan@1234', // Plain text password for comparison
    createdAt: new Date('2026-01-01T00:00:00.000Z')
};

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }

        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt
                },
                token
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating user',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
export const signin = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Check for sample user first (for testing when DB is not connected)
        if (email === SAMPLE_USER.email && password === SAMPLE_USER.password) {
            console.log('✓ Sample user login successful');
            const token = generateToken(SAMPLE_USER.id);
            
            return res.status(200).json({
                status: 'success',
                message: 'Login successful (Sample User)',
                data: {
                    user: {
                        id: SAMPLE_USER.id,
                        fullName: SAMPLE_USER.fullName,
                        email: SAMPLE_USER.email,
                        createdAt: SAMPLE_USER.createdAt
                    },
                    token
                }
            });
        }

        // Check if user exists and get password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Check if password matches
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt
                },
                token
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error logging in',
            error: error.message
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        // Check if it's the sample user
        if (req.user.id === SAMPLE_USER.id || req.user._id === SAMPLE_USER.id) {
            return res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        id: SAMPLE_USER.id,
                        fullName: SAMPLE_USER.fullName,
                        email: SAMPLE_USER.email,
                        createdAt: SAMPLE_USER.createdAt
                    }
                }
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching user data',
            error: error.message
        });
    }
};
