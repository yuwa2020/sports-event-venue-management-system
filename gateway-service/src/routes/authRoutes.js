import express from 'express';
import { login, register, verifyDuo, duoRedirect, forgotPassword, resetPassword, googleAuth, googleCallback } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register/user', register); 
router.post('/register/venue-owner', register);

router.post('/duo/callback', verifyDuo); 
router.get('/duo/callback', duoRedirect);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;
