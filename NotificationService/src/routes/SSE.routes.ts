import express from 'express';
import { handleSSEConnection } from '../controllers/SSE.controller'
const cors = require('cors');

const router = express.Router();

router.use(cors({
    origin: 'http://localhost:3000',
}));
router.get('/SSE', handleSSEConnection)

export default router;