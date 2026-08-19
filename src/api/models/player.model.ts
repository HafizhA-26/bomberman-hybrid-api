import supabase from "../../config/supabase"

export const PlayerModel = {
    async findByUsername(username: string) {
        const { data, error } = await supabase.from("players").select("*").eq("username", username).maybeSingle();
        
        if(error) 
            throw error;

        return data;
    },
    async upsertPlayer(username: string, device_id: string)
    {
        const { data, error } = await supabase.from('players').upsert({ username: username, device_id: device_id });
        
        if(error)
            throw error;
        
        return data;
    }
}