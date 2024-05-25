/**
 * @class       : logger
 * @author      : Keshav Goyal (keshav.goyal@kritikalvision.ai)
 * @created     : Tuesday August 29, 2023
 * @description : logging module
 */

const winston = require('winston')
const { format, transports } = require('winston');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
const util = require('util');
const os = require('os');
const config = require('config');
// const projectName = require('project-name');
const projectName = null;

var dotenv = require('dotenv')
dotenv.config()

const loggingConfig = config.get('logging');

let timestampFormat = null;
if (process.env.NODE_ENV !== 'production') {
  timestampFormat = format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  });
} else {
  if (loggingConfig.has('timestamp')) {
    timestampFormat = format.timestamp({
      format: loggingConfig.get('timestamp')
    });
  } else {
    timestampFormat = format.timestamp();
  }
}

let loggingFormat = format.combine(format.simple(),
    format.errors({ stack: true }),
    timestampFormat,
    format.printf(info => {
      const message = typeof info.message === 'object' ? util.inspect(info.message) : info.message;
      return `${info.timestamp} ${info.level}: ${message} ${info.stack ? '\n    '+info.stack : ''}`
    })
);

let consoleLoggingFormat = loggingFormat;
if (loggingConfig.has('colorize') && loggingConfig.get('colorize')) {
  consoleLoggingFormat = format.combine(format.colorize(), loggingFormat);
}

let logDir = null;
const hostname = config.has('host') ? config.get('host') : os.hostname();
if (loggingConfig.has('dirname')) {
  logDir = loggingConfig.get('dirname');
} else {
  if (process.env.NODE_ENV === 'production') {
    logDir = path.join(os.homedir(), hostname, projectName(), 'logs');
  } else {
    logDir = 'logs';
  }
}

const dailyRotateTransport = new (winston.transports.DailyRotateFile)({
  dirname: logDir,
  filename: loggingConfig.get('filename'),
  datePattern: loggingConfig.get('datePattern'),
  maxSize: loggingConfig.get('maxSize'),
});

let logger = null;
if (!process.env.NODE_ENV || process.env.NODE_ENV == 'local') {
  logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: loggingConfig.has('level') ? loggingConfig.get('level') : 'debug',
    format: loggingFormat,
    transports: [
      new transports.Console({ format: consoleLoggingFormat }),
      dailyRotateTransport,
    ],
    exitOnError: false, // do not exit on handled exceptions
    handleExceptions : true,
  });
}
else {
  const CloudWatchTransport = require('winston-aws-cloudwatch');
  const AWS = require('aws-sdk');

  AWS.config.update({
    accessKeyId: process.env.CLOUDWATCH_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
    region: 'us-west-2' // Replace with your desired AWS region
  });

  logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: loggingConfig.has('level') ? loggingConfig.get('level') : 'debug',
    format: loggingFormat,
    transports: [
      new winston.transports.Console(), // Output logs to console
      new CloudWatchTransport({
        logGroupName: 'EstimatorLogs',
        logStreamName: 'Estimator',
        awsConfig: AWS.config,
        jsonMessage: true, // Set this to true if you want the logs to be sent as JSON objects
        retentionInDays: 7 // Set the desired log retention period
      })
    ],
    exitOnError: false, // do not exit on handled exceptions
    handleExceptions : true,
  });
}

module.exports = logger;