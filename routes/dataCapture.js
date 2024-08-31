/**
 * @file Defines all routes for the Users route.
 */

const express = require('express')
const router = express.Router()

const controllers = require('../controller')

router
	.route('/')
	.post(controllers.dataCapture.log)

module.exports = router
