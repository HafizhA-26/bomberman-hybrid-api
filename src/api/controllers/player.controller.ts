
import { Request, Response } from "express";
import { PlayerModel } from "../models/player.model";

export async function GetPlayerByDevice(req: Request, res: Response) {
    try{
        const deviceId = req.params.deviceId as string;
        const data = await PlayerModel.findByDeviceId(deviceId);

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

        if(foundPlayer && foundPlayer.device_id != deviceId)
        {
            return res.status(400).json({
                status: "failed",
                message: "Username already taken"
            });
        }

        const insertedPlayer = await PlayerModel.upsert(username, deviceId);
        
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