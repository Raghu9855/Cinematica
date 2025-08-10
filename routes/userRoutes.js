import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// --- Profile Routes ---
router.get('/profile', userController.getProfilePage);
router.post('/update-profile', userController.updateProfile);

// --- Account Deletion Routes ---
router.get('/deleteaccount', userController.getDeleteAccountPage);
router.post('/deleteaccount', userController.deleteAccount);

export default router;