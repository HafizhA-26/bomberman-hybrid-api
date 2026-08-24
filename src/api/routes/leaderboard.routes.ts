import { Router } from "express";
import { UpdateRank } from "../controllers/leaderboard.controller";

const router = Router();
router.post("/", UpdateRank);

export default router;
