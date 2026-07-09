import {Router} from 'express';
import playerRoutes from './player.routes';
import leaderboardRoutes from './leaderboard.routes';

const router = Router();

// Add all route below
router.use('/players', playerRoutes);
router.use('/leaderboard', leaderboardRoutes);

export default router;