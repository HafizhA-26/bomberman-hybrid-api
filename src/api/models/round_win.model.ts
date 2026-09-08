import supabase from "../../config/supabase";
import { LeaderboardRequest } from "./leaderboard.model";

export interface WinRecordData
{
    enemyType: number,
    winCount: number,
    loseCount: number
}

export const RoundWinModel = {
    async getCurrentWinRecord(deviceId: string): Promise<WinRecordData[]>
    {
        const { data, error } = await supabase.from("round_win")
            .select("enemy_type, win_count, lose_count")
            .order("enemy_type", { ascending: true })
            .eq("device_id", deviceId)
        
        if(error) throw error;

        return data.map((record, index) => ({
            enemyType: record.enemy_type,
            winCount: record.win_count,
            loseCount: record.lose_count
        }));
    },

    async updateWinLoseCount(reqData: LeaderboardRequest): Promise<WinRecordData>
    {
        let winCount: number = 0;
        let loseCount: number = 0;
        const { data: winRecord, error: error_1 } = await supabase.from("round_win")
            .select("id, enemy_type, win_count, lose_count")
            .order("enemy_type", { ascending: true })
            .match({ device_id: reqData.deviceId, enemy_type: reqData.enemyType})
            .maybeSingle();
        
        if(error_1) throw error_1;

        if(winRecord)
        {
            winCount = winRecord.win_count;
            loseCount = winRecord.lose_count;
        }

        if(reqData.isWin)
            winCount++;
        else
            loseCount++;

        const { data: upsertedData, error: error_2 } = await supabase
            .from('round_win')
            .upsert({ id: winRecord?.id, device_id: reqData.deviceId, enemy_type: reqData.enemyType, win_count: winCount, lose_count: loseCount }, {onConflict: "id"})
            .select("*")
            .maybeSingle();

        if(error_2) throw error_2;

        return {
            enemyType: reqData.enemyType,
            winCount: upsertedData.win_count,
            loseCount: upsertedData.lose_count
        }    

    }
}