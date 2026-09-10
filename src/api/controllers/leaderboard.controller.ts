import { Request, Response } from "express";
import { LeaderboardData, LeaderboardModel, LeaderboardRequest, LeaderboardResponse, PlayerLeaderboard } from "../models/leaderboard.model";
import { RoundWinModel, WinRecordData } from "../models/round_win.model";

export async function PostRank(req: Request, res: Response) {
    try {
        const reqData = req.body as LeaderboardRequest;
        reqData.isWin = req.body.isWin.toLowerCase() == "true";

        const prevRankData: LeaderboardData | null = await LeaderboardModel.findByDeviceAndEnemy(reqData);
        const predictedRank: number = await LeaderboardModel.getPredictedRank(reqData);
        const winRecord: WinRecordData = await RoundWinModel.updateWinLoseCount(reqData);

        let playerRank: PlayerLeaderboard = {
            username: prevRankData?.username ?? null,
            actionCount: reqData.actionCount,
            playTime: reqData.playTime,
            rank: -1,
            bestRank: prevRankData?.rank ?? -1
        };

        if(reqData.isWin)
        {
            if(prevRankData)
            {
                playerRank = {
                    username: prevRankData.username,
                    actionCount: reqData.actionCount,
                    playTime: reqData.playTime,
                    bestRank: prevRankData.rank,
                    rank: predictedRank
                }
                
                // Check break record and update data
                if (prevRankData.playTime > reqData.playTime || (prevRankData.playTime == reqData.playTime && prevRankData.actionCount > reqData.actionCount)) {
                    console.log("Update Data");
                    const newRankData: LeaderboardData = await LeaderboardModel.update(reqData);
                    playerRank = newRankData as PlayerLeaderboard;
                    playerRank.bestRank = newRankData.rank;
                    playerRank.rank = newRankData.rank;
                }
            }else{
                const newRankData: LeaderboardData = await LeaderboardModel.insert(reqData);
                playerRank = newRankData as PlayerLeaderboard;
                playerRank.bestRank = newRankData.rank;
            }
        }

        const topLeaderboard: LeaderboardData[] = await LeaderboardModel.getTopLeaderboard(reqData.enemyType);

        const responseData: LeaderboardResponse = {
            topRanks: topLeaderboard,
            myRank: playerRank,
            winRecord: winRecord
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
