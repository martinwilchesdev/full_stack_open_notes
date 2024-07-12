const notesRouter = require('express').Router()

const logger = require('../utils/logger')
const Note = require('../models/notes')

const User = require('../models/user')

const jwt = require('jsonwebtoken')

// La funcion auxiliar getTokenFrom() aisla el TOKEN del encabezado authorization y lo retorna sin la cadena Bearer
const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) return authorization.replace('Bearer ', '')
    return null
}

notesRouter.get('/', async(req, res) => {
    const notes = await Note.find({}).populate('user', {username: 1, name: 1})

    res.json(notes)
})

notesRouter.post('/', async(req, res) => {
    const body = req.body

    /**
     * La validez del TOKEN se comprueba con `jwt.verify`.
     * El metodo jwt.verify decodifica el token o devuelve el objeto en que el que se baso el token.
     * Si el token es invalido o esta ausente en la peticion, el servidor retorna un `JsonWebTokenError`.
    */
    const userAuth = jwt.verify(getTokenFrom(req), process.env.SECRET)

    // El objeto decodificado contiene los campos username e id que le dicen al servidor que usuario hizo la solicitud
    if (!userAuth.id) return res.status(401).json({error: 'token invalid'})

    const user = await User.findById(userAuth.id)

    const note = new Note({
        important: body.important || false,
        content: body.content,
        user: user.id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote.id)

    // se actualiza el valor del campo notes del usuario consultado en la base de datos
    await user.save()

    res.status(201).json(savedNote)
})

notesRouter.put('/:id', (req, res) => {
    const note = {
        content: req.body.content,
        important: req.body.important
    }

    /**
     * El metodo findIdAndUpdate permite obtener un recurso individual a traves de su id y posteriormente actualizarlo.
     * El metodo findIdAndUpdate() rebibe como segundo argumento un objeto JavaScript en lugar de un objeto creado con el modelo Note.
    */
    Note.findByIdAndUpdate(req.params.id, note, {new: true})
        .then(response => {
            // El argumento {new: true} permite que la respuesta obtenga el nuevo documento modificado en lugar del original sin modificaciones
            if (response) {
                logger.info('note updated')

                res.json(response)
            } else {
                res.status(500).end()
            }
        })
})

notesRouter.delete('/:id', async(req, res) => {
    // el metodo findByIdAndDelete permite obtener un recurso individual a traves de su id y posteriormente eliminarlo
    await Note.findByIdAndDelete(req.params.id)
    logger.info('note deleted')

    res.status(204).end()
})

notesRouter.get('/:id', async(req, res) => {
    // el metodo findById() permite obtener un recurso individual a traves de su id
    const note = await Note.findById(req.params.id)

    note ? res.json(note) : res.status(404).end()
})

module.exports = notesRouter