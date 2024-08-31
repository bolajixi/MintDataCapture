const logger = require('../utils/logger')
const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
    if (err instanceof ErrorResponse) {
        const { message, statusCode, data } = err
        delete err.message //Prevents duplication of error message in the log message

        logger.error(message, err)

        res.status(statusCode).json({
            success: false,
            error: message,
            data: data || undefined,
        })
    } else {
        logger.error(err)

        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        })
    }
}

module.exports = errorHandler
