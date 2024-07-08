const mongoose = require('mongoose')

// Los identificadores de las notas se almacenaran dentro el documento del usuario como una matriz de IDs de Mongo
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        match: [/[a-z]/, 'the username must be contain only letters'],
        minLength: [5, 'the username is too short'],
        /**
         * La unicidad se logra definiendo un indice de unicidad para un campo especifico.
         * Si hay documentos en la base de datos que violan la condicion de unicidad, no se creara ningun indice.
        */
        unique: true
    },
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId, // El tipo de campo ObjectId hace referencia a documentos de tipo Note
            ref: 'Note'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
        // El password hash no debe mostrarse
        delete obj.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User