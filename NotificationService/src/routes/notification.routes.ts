import express from 'express';
import { postEvent, fetchEvents, fetchEventById } from '../controllers/notification.controller';

const router = express.Router();

router.post('/', postEvent);
router.get('/', fetchEvents);
router.get('/:id', fetchEventById);

export default router;