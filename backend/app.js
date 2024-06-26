const notesRouter = require('./controllers/notes')

const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const cors = require('cors')
const app = express()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info(`Connecting to mongodb...`)

mongoose.connect(config.MONGODB_URI)
    .then(success => {
        logger.info(`database connected successfully`)
    })
    .catch(error => {
        logger.error(`Error: ${error.message}`)
    })

app.use(cors())

app.use(express.static('dist'))
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.handleError)

module.exports = app