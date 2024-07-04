const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info(`Method: ${req.method}`)
    logger.info(`Path: ${req.path}`)
    logger.info('Body', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res, ) => {
    res.status(404).json({error: 'unknown endpoint'})
}

const handleError = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        res.status(400).json({error: 'malformatted id'})
    } else {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    handleError
}