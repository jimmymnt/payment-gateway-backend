const {format, createLogger, transports} = require("winston");
const {formatDate} = require("./date.util");
const {combine, timestamp, printf, errors, json, prettyPrint} = format;

const iLogger = createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: combine(
    errors({
      stack: true
    }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss A'
    }),
    json(),
    // prettyPrint(),
    // printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      dirname: 'storage/logs',
      filename: `${formatDate(new Date())}-debug.log`,
      level: 'debug',
    }),
    new transports.File({
      dirname: 'storage/logs',
      filename: `${formatDate(new Date())}-error.log`,
      level: 'error',
    }),
  ],
});

module.exports = {
  iLogger
};