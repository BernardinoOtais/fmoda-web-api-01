import { createLogger, format, transports } from "winston";

import { server } from "./config";

const isDevelopment = server.DEVELOPMENT === "development";
//console.log("isDevelopment : ", isDevelopment);

const devConsoleFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return log;
  })
);

const prodConsoleFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    // Compact one-line logs for better parsing
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

const logger = createLogger({
  level: isDevelopment ? "debug" : "info", // Use 'debug' level in development, 'info' in production
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp to logs
    format.printf(({ timestamp, level, message, ...meta }) => {
      let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
      if (Object.keys(meta).length) {
        log += ` ${JSON.stringify(meta)}`;
      }
      return log;
    })
  ),
  transports: [
    // Console transport: Only active in development
    ...(isDevelopment
      ? [
          new transports.Console({
            format: devConsoleFormat,
          }),
        ]
      : [
          new transports.Console({
            format: prodConsoleFormat,
          }),
        ]),
    // File transports: Always active
    new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors
    new transports.File({ filename: "logs/combined.log" }), // Log all messages
  ],
});

export default logger;
