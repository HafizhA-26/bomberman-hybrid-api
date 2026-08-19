import { Router } from 'express';
import { LoginPlayer } from '../controllers/player.controller';

const router = Router();

router.post('/login', LoginPlayer);

export default router;