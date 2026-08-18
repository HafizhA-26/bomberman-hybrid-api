import dotenv from 'dotenv';
import logger from '../utils/logger';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;


if(!supabaseUrl || !supabaseKey)
    logger.error("Supabase URL or key is not defined")

const supabase = createClient(supabaseUrl!, supabaseKey!);

export default supabase;