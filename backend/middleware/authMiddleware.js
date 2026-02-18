import jwt from 'jsonwebtoken';
import User from '../models/UserMySQL.js';

// Sample user for testing when database is not connected
const SAMPLE_USER = {
    id: 'sample-user-12345',
    _id: 'sample-user-12345',
    fullName: 'Sample User',
    email: 'dayplan1234@gmail.com',
    createdAt: new Date('2026-01-01T00:00:00.000Z')
};

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized to access this route. Please login.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if it's the sample user
            if (decoded.id === SAMPLE_USER.id) {
                req.user = SAMPLE_USER;
                return next();
            }

            // Get user from token
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpire'] }
            });

            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'Token is invalid or expired'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error in authentication'
        });
    }
};
