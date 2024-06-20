const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(success => {
        console.log('connected to db')
    })
    .catch(error => {
        console.log('error to connect db', error.message)
    })

const noteSchema = mongoose.Schema({
    content: String,
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, obj) => {
        obj.id = obj._id.toString(),
        delete obj._id,
        delete obj.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)