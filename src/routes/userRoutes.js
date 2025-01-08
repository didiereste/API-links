import express from 'express';
import { generateLink } from '../controllers/studentController.js';
import { authTokenJWT } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/generate-link',authTokenJWT, generateLink);

export default router;