import { Request, Response } from "express";
import { LeaderboardData, LeaderboardModel, LeaderboardRequest, LeaderboardResponse, PlayerLeaderboard } from "../models/leaderboard.model";

export async function UpdateRank(req: Request, res: Response)
{
    try{
        const reqData = req.body as LeaderboardRequest;

        const topLeaderboard: LeaderboardData[] = await LeaderboardModel.getTopLeaderboard();
        const prevRankData: LeaderboardData = await LeaderboardModel.findByDeviceAndEnemy(reqData);
        const predictedRank: number = await LeaderboardModel.getPredictedRank(reqData);

        let playerRank: PlayerLeaderboard = prevRankData as PlayerLeaderboard;
        playerRank.bestRank = prevRankData.rank;
        playerRank.rank = predictedRank;

        // Check break record and update data
        if(prevRankData.playTime > reqData.playTime || (prevRankData.playTime == reqData.playTime && prevRankData.actionCount > reqData.actionCount))
        {
            const newRankData: LeaderboardData = await LeaderboardModel.upsert(reqData);
            playerRank = newRankData as PlayerLeaderboard;
            playerRank.bestRank = newRankData.rank;
        }

        const responseData: LeaderboardResponse = {
            topRanks: topLeaderboard,
            myRank: playerRank
        };

        return res.status(200).send({
            data: responseData,
            status: "success",
            message: "Success posted new gameplay rank"
        });      
    }catch(error)
    {
        console.error(error);
        return res.status(500).json({
            status: "failed",
            message: "Internal server error"
        })
    }
}