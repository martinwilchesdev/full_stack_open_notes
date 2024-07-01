process.loadEnvFile()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'development'
    ? process.env.TEST_MONGODB_URI
    : process.env.TEST_MONGODB_URI

module.exports = { PORT, MONGODB_URI }