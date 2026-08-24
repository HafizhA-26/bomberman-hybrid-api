import { Request, Response } from "express";
import { LeaderboardData, LeaderboardModel, LeaderboardRequest, LeaderboardResponse, PlayerLeaderboard } from "../models/leaderboard.model";

export async function UpdateRank(req: Request, res: Response) {
    try {
        const reqData = req.body as LeaderboardRequest;

        console.log("Get Top Leaderboard");
        const topLeaderboard: LeaderboardData[] = await LeaderboardModel.getTopLeaderboard();
        console.log("Get Prev Rank Data");
        const prevRankData: LeaderboardData = await LeaderboardModel.findByDeviceAndEnemy(reqData);
        console.log("Get Predicted Rank Data");
        const predictedRank: number = await LeaderboardModel.getPredictedRank(reqData);

        let playerRank: PlayerLeaderboard = prevRankData as PlayerLeaderboard;
        playerRank.bestRank = prevRankData.rank;
        playerRank.rank = predictedRank;

        // Check break record and update data
        if (prevRankData.playTime > reqData.playTime || (prevRankData.playTime == reqData.playTime && prevRankData.actionCount > reqData.actionCount)) {
            console.log("Upsert Data");
            const newRankData: LeaderboardData = await LeaderboardModel.upsert(reqData);
            playerRank = newRankData as PlayerLeaderboard;
            playerRank.bestRank = newRankData.rank;
        }

        const responseData: LeaderboardResponse = {
            topRanks: topLeaderboard,
            myRank: playerRank,
        };

        return res.status(200).send({
            data: responseData,
            status: "success",
            message: "Success posted new gameplay rank",
        });
    } catch (error) {
        console.error("Leaderboard UpdateRank Error:", error);
        if (error instanceof Error) {
            console.error("name:", error.name);
            console.error("message:", error.message);
            console.error("stack:", error.stack);
        }
        return res.status(500).json({
            status: "failed",
            message: "Internal server error",
        });
    }
}
