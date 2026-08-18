import { Request, Response, NextFunction } from 'express';
import config from '../../config';
import logger from '../../utils/logger';

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
  
) => {
    logger.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      stack: config.nodeEnv === 'development' ? err.stack : undefined,
    });
  
}