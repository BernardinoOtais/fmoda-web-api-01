import { createLogger, format, transports } from 'winston';

import { server } from './config';

const isDevelopment = server.DEVELOPMENT;

const logger = createLogger({
  level: isDevelopment ? 'debug' : 'info', // Use 'debug' level in development, 'info' in production
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to logs
    format.printf(({ timestamp, level, message, ...meta }) => {
      let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
      if (Object.keys(meta).length) {
        log += ` ${JSON.stringify(meta)}`;
      }
      return log;
    }),
  ),
  transports: [
    // Console transport: Only active in development
    ...(isDevelopment
      ? [
          new transports.Console({
            format: format.combine(
              format.colorize(), // Add colors for better readability in the console
              format.simple(), // Simplified format for console output
            ),
          }),
        ]
      : []),
    // File transports: Always active
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors
    new transports.File({ filename: 'logs/combined.log' }), // Log all messages
  ],
});

export default logger;
