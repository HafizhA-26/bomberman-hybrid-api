import { Router } from 'express';
import { GetPlayerByDevice, LoginPlayer } from '../controllers/player.controller';

const router = Router();

router.get("/check/:deviceId", GetPlayerByDevice);
router.put("/update", LoginPlayer);

export default router;