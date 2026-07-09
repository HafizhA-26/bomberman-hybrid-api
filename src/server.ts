import app from './app';
import config from './config';
import logger from './utils/logger';

const PORT = config.port;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
  })
  .on('error', (err) => {
    logger.error(err);
    process.exit(1);
  });
