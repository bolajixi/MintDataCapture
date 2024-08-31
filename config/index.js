const dotenv = require('dotenv')
var path = require('path')

if (process.env.NODE_ENV != 'production') {
	dotenv.config({ path: path.resolve(__dirname, '.env') })
}

module.exports = {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	logFilePath: process.env.LOG_FILE_PATH,
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
