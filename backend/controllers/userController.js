import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Sample user for testing when database is not connected
const SAMPLE_USER = {
    id: 'sample-user-12345',
    _id: 'sample-user-12345',
    fullName: 'Sample User',
    email: 'dayplan1234@gmail.com',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    emailNotifications: false,
    notificationTime: '09:00'
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.userId;

        // Check if it's the sample user
        if (userId === SAMPLE_USER.id) {
            return res.status(200).json({
                status: 'success',
                data: {
                    user: SAMPLE_USER
                }
            });
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch user profile'
        });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.userId;
        const { fullName, email } = req.body;

        // Check if it's the sample user
        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot modify sample user profile'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already in use'
                });
            }
            user.email = email;
        }

        // Update full name if provided
        if (fullName) {
            user.fullName = fullName;
        }

        await user.save();

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: userResponse
            }
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update profile'
        });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.userId;
        const { currentPassword, newPassword } = req.body;

        // Check if it's the sample user
        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot change password for sample user'
            });
        }

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide current password and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'New password must be at least 6 characters long'
            });
        }

        // Get user with password
        const user = await User.findById(userId).select('+password');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Verify current password
        const isPasswordCorrect = await user.comparePassword(currentPassword);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 'error',
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to change password'
        });
    }
};

// Delete account
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.userId;
        const { password } = req.body;

        // Check if it's the sample user
        if (userId === SAMPLE_USER.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot delete sample user account'
            });
        }

        if (!password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide your password to confirm account deletion'
            });
        }

        // Get user with password
        const user = await User.findById(userId).select('+password');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Verify password
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect password'
            });
        }

        // Delete user
        await User.findByIdAndDelete(req.userId);

        res.status(200).json({
            status: 'success',
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete account'
        });
    }
};
