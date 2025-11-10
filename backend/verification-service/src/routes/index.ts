import { Router } from 'express';
import verificationRoutes from './verificationRoutes';
import healthRoutes from './healthRoutes';

const router = Router();

// Mount routes
router.use('/api/verify', verificationRoutes);
router.use('/health', healthRoutes);

export default router;
