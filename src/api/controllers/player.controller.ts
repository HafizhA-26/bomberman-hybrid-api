
import { Request, Response } from "express";
import { InitPlayerResponse, PlayerModel } from "../models/player.model";
import { RoundWinModel, WinRecordData } from "../models/round_win.model";

export async function GetPlayerByDevice(req: Request, res: Response) {
    try{
        const deviceId = req.params.deviceId as string;
        const playerData = await PlayerModel.findByDeviceId(deviceId);

        let data : InitPlayerResponse | null = null; 

        if(playerData)
        {
            data = playerData as InitPlayerResponse;
            const winRecordData : WinRecordData[] = await RoundWinModel.getCurrentWinRecord(deviceId);
            data.winRecords = winRecordData;
        }

        return res.status(200).json({
            data,
            status: "success",
            message: "Success get player data"
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

export async function LoginPlayer(req: Request, res: Response) {
    try{
        const { username, deviceId } = req.body;
        const foundPlayer = await PlayerModel.findByUsername(username);

        if(foundPlayer && foundPlayer.deviceId != deviceId)
        {
            return res.status(200).json({
                status: "failed",
                message: "Username already taken"
            });
        }

        const insertedPlayer : InitPlayerResponse = await PlayerModel.upsert(username, deviceId) as InitPlayerResponse;
        const winRecordData : WinRecordData[] = await RoundWinModel.getCurrentWinRecord(deviceId);
        insertedPlayer.winRecords = winRecordData;
        
        return res.status(200).json({
            data: insertedPlayer,
            status: "success",
            message: "Success login player"
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