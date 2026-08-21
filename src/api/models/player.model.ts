import supabase from "../../config/supabase"

export const PlayerModel = {
    async findByUsername(username: string) {
        const { data, error } = await supabase.from("players").select("*").eq("username", username).maybeSingle();
        
        if(error) 
            throw error;

        return data;
    },

    async findByDeviceId(deviceId: string) {
        const { data, error } = await supabase.from("players").select("*").eq("device_id", deviceId).maybeSingle();
        
        if(error)
            throw error;

        return data;
    },

    async upsert(username: string, device_id: string)
    {
        const { data, error } = await supabase
            .from('players')
            .upsert({ username: username, device_id: device_id }, {onConflict: "device_id"})
            .select("*");
        
        if(error)
            throw error;
        
        return data;
    }
}