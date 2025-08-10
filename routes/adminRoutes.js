import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// NOTE: Inside this file, '/admin' is represented as just '/'
router.get('/', adminController.showDashboard);
router.post('/add-movie', adminController.addMovie);
router.post('/replace-trending', adminController.replaceTrendingMovie);
router.get('/delete-movie/:id', adminController.deleteMovie);

export default router;