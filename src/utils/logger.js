const {format, createLogger, transports} = require("winston");
const {combine, timestamp, prettyPrint, label} = format;

const logger = createLogger({
  level: "debug",
  format: combine(
    label({label: 'winston-logger'}),
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint(),
  ),
  transports: [new transports.Console()],
});

module.exports = logger;