import { Router } from "express";
import { PostRank } from "../controllers/leaderboard.controller";

const router = Router();
router.post("/", PostRank);

export default router;
