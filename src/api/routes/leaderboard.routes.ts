import { Router } from "express";
import { UpdateRank } from "../controllers/leaderboard.controller";

const router = Router();
router.post("/leaderboard", UpdateRank);

export default router;