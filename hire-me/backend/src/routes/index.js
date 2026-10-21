import { Router } from 'express';
import mongoose from 'mongoose';
import adminRoutes from '../modules/admin/admin.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import catalogRoutes from '../modules/catalog/catalog.routes.js';
import profileRoutes from '../modules/profile/profile.routes.js';
import publicRoutes from '../modules/public/public.routes.js';
import resumeRoutes from '../modules/resumes/resume.routes.js';
import reviewRoutes from '../modules/reviews/review.routes.js';
import uploadRoutes from '../modules/uploads/upload.routes.js';
import userRoutes from '../modules/users/user.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    database: mongoose.connection.readyState === 1 ? 'up' : 'down',
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/uploads', uploadRoutes);
router.use('/profile', profileRoutes);
router.use('/resumes', resumeRoutes);
router.use('/public', publicRoutes);
router.use('/', catalogRoutes); //  GET /templates, /templates/:slug, /categories (public)
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);

export default router;
