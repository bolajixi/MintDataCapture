/**
 * @file Defines all root routes for the application.
 */

module.exports = {
	healthCheckRouter: require('./healthCheck'),
	dataCaptureRouter: require('./dataCapture'),
	unhandledRouter: require('./unhandled'),
}
