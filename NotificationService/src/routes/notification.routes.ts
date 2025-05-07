import express from 'express';
import { postNotification, fetchNotifications, fetchNotificationById } from '../controllers/notification.controller';

const router = express.Router();

router.post('/', postNotification);
router.get('/', fetchNotifications);
router.get('/:id', fetchNotificationById);

export default router;