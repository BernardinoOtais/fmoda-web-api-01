import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = process.env.LOG_API || "logs-web";
const isDevelopment = (process.env.NODE_ENV ?? "development") === "development";

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
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

const fileFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.json(),
  format.prettyPrint()
);

const loggerApi = createLogger({
  level: isDevelopment ? "debug" : "info",
  transports: [
    // Console transport
    new transports.Console({
      format: isDevelopment ? devConsoleFormat : prodConsoleFormat,
    }),

    // Rotating error log (production)
    ...(isDevelopment
      ? [
          new transports.File({
            filename: `${logDir}/error.log`,
            level: "error",
            format: fileFormat,
          }),
          new transports.File({
            filename: `${logDir}/combined.log`,
            format: fileFormat,
          }),
        ]
      : [
          new DailyRotateFile({
            filename: `${logDir}/error-%DATE%.log`,
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxSize: "20m",
            maxFiles: "14d",
            format: fileFormat,
          }),
          new DailyRotateFile({
            filename: `${logDir}/combined-%DATE%.log`,
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
            format: fileFormat,
          }),
        ]),
  ],
  exitOnError: false,
});

// Exception & rejection handlers (production only)
if (!isDevelopment) {
  loggerApi.exceptions.handle(
    new transports.File({ filename: `${logDir}/exceptions.log` })
  );

  loggerApi.rejections.handle(
    new transports.File({ filename: `${logDir}/rejections.log` })
  );
}

export default loggerApi;
