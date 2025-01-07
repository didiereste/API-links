import express from 'express';
import { generateLink } from '../controllers/studentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/generate-link',authenticateToken, generateLink);

export default router;