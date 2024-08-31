/**
 * @file Defines API status check.
 */

const express = require('express')
const router = express.Router()
const controllers = require('../controller')

router.get('/', controllers.healthCheck.info)

module.exports = router
