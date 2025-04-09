import express from 'express';
import { postUser, fetchUsers, fetchUserById } from '../controllers/user.controller';

const router = express.Router();

router.post('/', postUser);
router.get('/', fetchUsers);
router.get('/:id', fetchUserById);

export default router;