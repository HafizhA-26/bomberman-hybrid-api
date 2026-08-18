import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './api/routes';
import supabase from './config/supabase';
import { errorHandler } from './api/middlewares/errorHandler.middleware';

const app: Application = express();

app.use(cors());
app.use(helmet()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'Bomberman API is running!' });
});

app.get('/test-db', async (req: Request, res: Response) => {
    // Mencoba mengambil data dari tabel players (meski masih kosong)
    const { data, error } = await supabase.from('players').select('*').limit(1);
    
    if (error) {
        return res.status(500).json({ status: 'Database Error', error: error.message });
    }
    
    res.status(200).json({ status: 'Supabase Connected!', data });
});

app.use('/api', apiRoutes);

// Middleware untuk Error Handling (harus diletakkan paling akhir)
app.use(errorHandler);

export default app;
