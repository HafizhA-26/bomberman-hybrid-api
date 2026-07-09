import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './api/routes';
import { errorHandler } from './api/middlewares/errorHandler.middleware';

// Inisialisasi aplikasi Express
const app: Application = express();

// Middleware
app.use(cors()); // Mengizinkan Cross-Origin Resource Sharing
app.use(helmet()); 
app.use(express.json()); // Mem-parse body request sebagai JSON
app.use(express.urlencoded({ extended: true }));

// Logger untuk request (morgan)
app.use(morgan('dev'));

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'Bomberman API is running!' });
});

// Rute Utama API
app.use('/api', apiRoutes);

// Middleware untuk Error Handling (harus diletakkan paling akhir)
app.use(errorHandler);

export default app;
