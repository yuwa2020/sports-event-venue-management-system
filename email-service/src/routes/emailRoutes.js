import express from 'express';
import { sendBookingEmails, sendCancelledEmail, sendResetEmail } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-booking-emails', sendBookingEmails);
router.post('/send-cancelled-emails', sendCancelledEmail);
router.post('/send-reset-email', sendResetEmail);
export default router;
