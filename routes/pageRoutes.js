import express from 'express';
import * as pageController from '../controllers/pageController.js';

const router = express.Router();

router.get("/", pageController.showWelcomePage);
router.get("/contact", pageController.showContactPage);
router.get("/subscription", pageController.showSubscriptionPage);
router.get("/qr", pageController.showQrPage);
router.get("/logout", pageController.handleLogout);

export default router;