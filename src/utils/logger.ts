// ANSI color codes untuk output terminal yang lebih informatif
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

const log = (level: string, color: string, message: string, ...args: unknown[]) => {
  const timestamp = new Date().toISOString();
  const formattedMessage = `${color}[${level.toUpperCase()}]${colors.reset} ${timestamp}: ${message}`;

  if (args.length > 0) {
    console.log(formattedMessage, ...args);
  } else {
    console.log(formattedMessage);
  }
};

const logger = {
  info: (message: string, ...args: unknown[]) => log('info', colors.green, message, ...args),
  warn: (message: string, ...args: unknown[]) => log('warn', colors.yellow, message, ...args),
  error: (message: string | Error, ...args: unknown[]) => {
    const errorMessage = message instanceof Error ? (message.stack || message.message) : message;
    log('error', colors.red, errorMessage, ...args);
  },
};

export default logger;