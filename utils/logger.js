const { createLogger, format, transports } = require('winston')
const { combine, label, timestamp, printf, json } = format

const config = require('../config')

const console = new transports.Console()
const file = new transports.File({
	filename: config.logFilePath,
	level: 'error',
})

const customFormat = printf(({ level, label, message, timestamp, stack }) => {
	return stack
		? `${timestamp} ${label} ${level}: ${message}\n${stack}`
		: `${timestamp} ${label} ${level}: ${message}`
})

const logger = createLogger({
	format: combine(
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		label({ label: config.env }),
		format.errors({ stack: true }),
		config.env !== 'production' ? customFormat : json(),
	),
	transports: [config.env !== 'production' ? console : file],
})

module.exports = logger
