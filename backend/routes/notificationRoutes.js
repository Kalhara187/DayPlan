import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getNotificationSettings,
    updateNotificationSettings,
    sendTestEmail
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes are protected
router.get('/settings', protect, getNotificationSettings);
router.put('/settings', protect, updateNotificationSettings);
router.post('/test', protect, sendTestEmail);

export default router;
