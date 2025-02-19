import KEYS from "src/globals/keys";
import { createLogger, format, transports } from "winston";

// Define log levels
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

// Initialize logger
const logger = createLogger({
  levels: logLevels.levels,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) =>
        `[${info.timestamp}] [${info.level.toUpperCase()}] ${
          typeof info.message === "string"
            ? info.message
            : JSON.stringify(info.message)
        }`
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `${KEYS.APP_ENVS.LOGS_DIR}/error.log`,
      level: "error",
    }),
    new transports.File({ filename: `${KEYS.APP_ENVS.LOGS_DIR}/combined.log` }),
  ],
});

export default logger;
