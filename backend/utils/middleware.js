const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info(`Method: ${req.method}`)
    logger.info(`Path: ${req.path}`)
    logger.info('Body', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res,) => {
    res.status(404).json({ error: 'unknown endpoint' })
}

const handleError = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        res.status(400).json({ error: 'malformatted id' })
    }
    // Las validaciones de mongoose no detectan la violacion del indice especifico y en lugar de ValidationError devuelve un error MongoServerError
    else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return res.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'token invalid' })
    } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' })
    } else {
        return res.status(400).json({ error: error.message })
    }
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    handleError
}