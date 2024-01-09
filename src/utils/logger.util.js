const {format, createLogger, transports} = require("winston");
const {formatDate} = require("./date.util");
const {combine, timestamp, printf, errors, json, prettyPrint} = format;


const logger = createLogger({
  // level: process.env.LOG_LEVEL || "debug",
  // format: combine(
  //   errors({
  //     stack: true
  //   }),
  //   timestamp({
  //     format: 'YYYY-MM-DD hh:mm:ss A'
  //   }),
  //   json(),
  //   prettyPrint(),
  //   // printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
  // ),
  level: process.env.LOG_LEVEL || 'info',
  format: format.json(),
  transports: [
    new transports.Console(),
    // new transports.File({
    //   dirname: 'storage/logs',
    //   filename: `${formatDate(new Date())}-debug.log`,
    //   level: 'debug',
    // }),
    // new transports.File({
    //   dirname: 'storage/logs',
    //   filename: `${formatDate(new Date())}-error.log`,
    //   level: 'error',
    // }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exception.log' }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'rejections.log' }),
  ],
  exitOnError: false,
});

module.exports = logger;