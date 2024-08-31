const dotenv = require('dotenv')
var path = require('path')

if (process.env.NODE_ENV != 'production') {
	dotenv.config({ path: path.resolve(__dirname, '.env') })
}

module.exports = {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	logLevel: process.env.LOG_LEVEL || 'error',
	logFilePath: process.env.LOG_FILE_PATH || "../log/",
	logFileName: process.env.LOG_FILE_NAME || 'filelog-error.log',
	notion: {
		apiKey: process.env.NOTION_API_KEY,
		databaseId: process.env.NOTION_DATABASE_ID
	},
	cors: {
		allowedOrigin: process.env.ALLOWED_ORIGIN,
		allowedHeaders:
			process.env.ALLOWED_HEADERS || 'Content-Type, Authorization',
	},
}
