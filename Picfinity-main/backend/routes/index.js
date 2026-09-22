import { Router } from 'express';
import authRoutes from './authRoutes.js';
import photoRoutes from './photoRoutes.js';

const router = Router();

router.use('/user', authRoutes);
router.use('/photo', photoRoutes);

export default router;