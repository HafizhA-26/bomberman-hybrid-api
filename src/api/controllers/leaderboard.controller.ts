import { Request, Response } from "express";
import { LeaderboardData, LeaderboardModel, LeaderboardRequest, LeaderboardResponse, PlayerLeaderboard } from "../models/leaderboard.model";

export async function PostRank(req: Request, res: Response) {
    try {
        const reqData = req.body as LeaderboardRequest;

        console.log("Get Prev Rank Data");
        const prevRankData: LeaderboardData | null = await LeaderboardModel.findByDeviceAndEnemy(reqData);
        console.log("Get Predicted Rank Data");
        const predictedRank: number = await LeaderboardModel.getPredictedRank(reqData);

        let playerRank: PlayerLeaderboard;
        if(prevRankData)
        {
            playerRank = prevRankData as PlayerLeaderboard;
            playerRank.bestRank = prevRankData.rank;
            playerRank.rank = predictedRank;
            
            // Check break record and update data
            if (prevRankData.playTime > reqData.playTime || (prevRankData.playTime == reqData.playTime && prevRankData.actionCount > reqData.actionCount)) {
                console.log("Update Data");
                const newRankData: LeaderboardData = await LeaderboardModel.update(reqData);
                playerRank = newRankData as PlayerLeaderboard;
                playerRank.bestRank = newRankData.rank;
                playerRank.rank = newRankData.rank;
            }
        }else{
            console.log("Insert Data");
            const newRankData: LeaderboardData = await LeaderboardModel.insert(reqData);
            playerRank = newRankData as PlayerLeaderboard;
            playerRank.bestRank = newRankData.rank;
        }

        console.log("Get Top Leaderboard");
        const topLeaderboard: LeaderboardData[] = await LeaderboardModel.getTopLeaderboard();

        const responseData: LeaderboardResponse = {
            topRanks: topLeaderboard,
            myRank: playerRank,
        };

        return res.status(200).send({
            data: responseData,
            status: "success",
            message: "Success posted new gameplay rank",
        });
    } catch (error: unknown) {
        console.error("Leaderboard Error:", error);

        return res.status(500).json({
            status: "failed",
            message: "Internal server error",
        });
    }
}
