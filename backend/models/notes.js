const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    content: {
        required: true,
        minLength: 5,
        type: String
    },
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)