/**
 * @file Defines the unhandled route handler.
 */

const express = require('express')
const ErrorResponse = require('../utils/errorResponse')

const router = express.Router()

/**
 * Throws a 404 not found error for all requests.
 */
router.get('*', (req, res) => {
	throw new ErrorResponse(404, 'Resource not found')
})

module.exports = router
