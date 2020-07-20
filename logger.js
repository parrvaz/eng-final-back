const winston = require("winston");
const { format, transport } = require("winston");
const { printf } = format;
const logger = winston.createLogger({
  level: "info",
  format: printf((item) => `- level: ${item.level}\n\tmessage: ${item.msg}\n`),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

function log(level, msg) {
  logger.log({ level, msg });
}

module.exports = { log };
