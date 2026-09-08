import supabase from "../../config/supabase";
import { WinRecordData } from "./round_win.model";

export interface LeaderboardRequest {
    deviceId: string;
    actionCount: number;
    playTime: number;
    enemyType: number;
    isWin: boolean
}
export interface LeaderboardData {
    rank: number;
    username: string;
    actionCount: number;
    playTime: number;
}

export interface PlayerLeaderboard extends LeaderboardData {
    bestRank: number;
}

export interface LeaderboardResponse {
    topRanks: LeaderboardData[];
    myRank: PlayerLeaderboard;
    winRecord: WinRecordData
}

export const LeaderboardModel = {
    async getTopLeaderboard(enemyType: number): Promise<LeaderboardData[]> {
        const { data, error } = await supabase.from("leaderboard_view")
            .select("username, action_count, playtime")
            .order("playtime", { ascending: true })
            .order("action_count", { ascending: true })
            .eq("enemy_type", enemyType)
            .limit(10);

        if (error) throw error;

        const result: LeaderboardData[] = data.map((player, index) => ({
            username: player.username,
            actionCount: player.action_count,
            playTime: player.playtime,
            rank: index + 1,
        }));

        return result;
    },
    async getPredictedRank(req: LeaderboardRequest): Promise<number> {
        const { count, error } = await supabase
            .from("leaderboards")
            .select("*", { count: "exact", head: true })
            .eq("enemy_type", req.enemyType)
            .or(`playtime.lt.${req.playTime},and(playtime.eq.${req.playTime},action_count.lt.${req.actionCount})`);

        if (error) throw error;

        return (count || 0) + 1;
    },
    async findByDeviceAndEnemy(req: LeaderboardRequest): Promise<LeaderboardData | null> {
        const { data: playerData, error: error_1 } = await supabase
            .from("leaderboard_view")
            .select("username, action_count, playtime")
            .match({ device_id: req.deviceId, enemy_type: req.enemyType })
            .maybeSingle();

        if (error_1)
            throw error_1;

        if (!playerData) 
            return playerData;

        const { data, count: playerRank, error: error_2 } = await supabase
            .from("leaderboard_view")
            .select("*", { count: "exact", head: true })
            .match({ enemy_type: req.enemyType })
            .or(`playtime.lt.${playerData.playtime},and(playtime.eq.${playerData.playtime},action_count.lt.${playerData.action_count})`);
        if (error_2) 
            throw error_2;

        const result: LeaderboardData = {
            rank: (playerRank || 0) + 1,
            username: playerData.username,
            actionCount: playerData.action_count,
            playTime: playerData.playtime,
        };

        return result;
    },
    async insert(req: LeaderboardRequest): Promise<LeaderboardData> {
        const { data: playerData, error: error_1 } = await supabase
            .from("leaderboards")
            .insert(
                {
                    device_id: req.deviceId,
                    playtime: req.playTime,
                    action_count: req.actionCount,
                    enemy_type: req.enemyType,
                },
            )
            .select("players!inner(username),action_count,playtime")
            .single();
        if (error_1) throw error_1;

        const { count: playerRank, error: error_2 } = await supabase
            .from("leaderboard_view")
            .select("*", { count: "exact", head: true })
            .match({ enemy_type: req.enemyType })
            .or(`playtime.lt.${playerData.playtime},and(playtime.eq.${playerData.playtime},action_count.lt.${playerData.action_count})`);

        if (error_2) throw error_2;

        const result: LeaderboardData = {
            rank: (playerRank || 0) + 1,
            // @ts-ignore
            username: playerData.players.username,
            actionCount: playerData.action_count,
            playTime: playerData.playtime,
        };
        return result;
    },
    async update(req: LeaderboardRequest): Promise<LeaderboardData> {
        const { data: playerData, error: error_1 } = await supabase
            .from("leaderboards")
            .update(
                {
                    device_id: req.deviceId,
                    playtime: req.playTime,
                    action_count: req.actionCount,
                    enemy_type: req.enemyType,
                },
            )
            .match({ device_id: req.deviceId, enemy_type: req.enemyType })
            .select("players!inner(username),action_count,playtime")
            .single();
        if (error_1) throw error_1;
            
        const { count: playerRank, error: error_2 } = await supabase
            .from("leaderboard_view")
            .select("*", { count: "exact", head: true })
            .match({ enemy_type: req.enemyType })
            .or(`playtime.lt.${playerData.playtime},and(playtime.eq.${playerData.playtime},action_count.lt.${playerData.action_count})`);

        if (error_2) throw error_2;

        const result: LeaderboardData = {
            rank: (playerRank || 0) + 1,
            // @ts-ignore
            username: playerData.players.username,
            actionCount: playerData.action_count,
            playTime: playerData.playtime,
        };

        return result;
    },
};
