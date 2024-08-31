const express = require('express');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');

const errorHandler = require('./middleware/errorhandler')
const response = require('./middleware/customResponse')

const logger = require('./utils/logger');
const config = require('./config');

const {
    dataCaptureRouter,
    unhandledRouter,
} = require('./routes')

const app = express();

app.use(response)
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(xss());
app.use(hpp());

// Log incoming requests
app.use((req, res, next) => {
    logger.info(req.originalUrl)
    next()
})

app.use('/api/v1/log', dataCaptureRouter)
app.use('*', unhandledRouter)

app.use(errorHandler)

const PORT = config.port

const server = app.listen(PORT, () => {
    logger.info(`Server running in ${config.env} mode on port ${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    logger.error(`Error: ${err.message}\nStack: ${err.stack}`)
    server.close(() => process.exit(1))
})

process.on('SIGINT', () => {
    logger.info(`SIGINT - Server shutting down gracefully ...`)

    server.close(async () => {
        process.exit(1)
    })
})

process.on('SIGTERM', () => {
    logger.info(`SIGTERM - Server shutting down gracefully ...`)

    server.close(() => {
        process.exit(1)
    })
})
