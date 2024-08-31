const ErrorResponse = require('../utils/errorResponse')

function extendResponseObject(req, res, next) {
	res.ok = function (statusCode = 200, data, pagination) {
		const response = {
			success: true,
			data: data,
		}

		if (pagination) {
			response.pagination = pagination
		}

		res.status(statusCode).json(response)
	}

	res.fail = function (error) {
		if (error instanceof ErrorResponse && !error.message) {
			switch (error.statusCode) {
				case 400:
					error.message = 'Bad Request'
					break
				case 401:
					error.message = 'Unauthorized'
					break
				case 403:
					error.message = 'Forbidden'
					break
				case 404:
					error.message = 'Not Found'
					break
				case 500:
					error.message = 'Internal Server Error'
					break
				default:
					error.message = 'Unknown Error'
			}
		} else if (!(error instanceof ErrorResponse)) {
			error = new ErrorResponse(500, error.message, error?.data, error?.stack)
		}

		next(error)
	}

	next()
}

module.exports = extendResponseObject
