import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
    level: 'info', // Set the minimum level of logs you want to capture (e.g., 'info', 'warn', 'error')
    format: combine(
        timestamp(),
        errors({ stack: true }), // Log the stack trace for errors
        logFormat
    ),
    transports: [
        new transports.Console(), // Log to the console
        new transports.File({ filename: 'app.log' }) // Log to a file named 'app.log'
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'exceptions.log' }) // Log uncaught exceptions to 'exceptions.log'
    ]
});

export default logger;
