import supabase from "../../config/supabase"

export interface PlayerResponse {
    username: string,
    deviceId: string,
    createdAt: Date
}

export const PlayerModel = {
    async findByUsername(username: string) : Promise<PlayerResponse | null> {
        const { data, error } = await supabase.from("players").select("*").eq("username", username).maybeSingle();
        
        if(error) 
            throw error;

        if(!data)
            return null;

        return {
            username: data.username,
            deviceId: data.device_id,
            createdAt: data.created_at
        };
    },

    async findByDeviceId(deviceId: string) : Promise<PlayerResponse | null> {
        const { data, error } = await supabase.from("players").select("*").eq("device_id", deviceId).maybeSingle();
        
        if(error)
            throw error;

        if(!data)
            return null;

        return {
            username: data.username,
            deviceId: data.device_id,
            createdAt: data.created_at
        };
    },

    async upsert(username: string, device_id: string) : Promise<PlayerResponse>
    {
        const { data, error } = await supabase
            .from('players')
            .upsert({ username: username, device_id: device_id }, {onConflict: "device_id"})
            .select("*")
            .maybeSingle();
        
        if(error)
            throw error;
        
        return {
            username: data.username,
            deviceId: data.device_id,
            createdAt: data.created_at
        };
    }
}