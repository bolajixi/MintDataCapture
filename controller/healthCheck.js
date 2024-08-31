const asyncHandler = require('../middleware/asyncHandler')
const config = require('../config')

module.exports = {
	// @desc    API status check
	// @route   POST /api/v1/
	// @access  Public
	info: asyncHandler(async (req, res, next) => {
		const response = {
			serviceName: 'mintDataCapture-api-v1',
			version: '1.0.0',
			healthStatus: 'OK',
			timestamp: Date.now(),
		}

		if (config.env == 'development') {
			response.environment = config.env
			response.nodeVersion = process.version
			response.uptime = process.uptime()
			response.memoryUsage = process.memoryUsage()
			response.cpuUsage = process.cpuUsage()
			response.platform = process.platform
			response.arch = process.arch
			response.pid = process.pid
		}

		res.ok(200, response)
	}),
}
