const notesRouter = require('express').Router()
const logger = require('../utils/logger')
const Note = require('../models/notes')

notesRouter.get('/', async(req, res) => {
    const notes = await Note.find({})
    res.json(notes)
})

notesRouter.post('/', async(req, res) => {
    const body = req.body?.content

    if (body) {
        const note = new Note({
            content: body,
            important: body.important || false
        })

        const savedNote = await note.save()
        res.status(201).json(savedNote)
    } else {
        res.status(400).json({error: "content field is required"})
    }
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

notesRouter.delete('/:id', (req, res) => {
    // el metodo findByIdAndDelete permite obtener un recurso individual a traves de su id y posteriormente eliminarlo
    Note.findByIdAndDelete(req.params.id)
        .then(result => {
            logger.info('note deleted')
            res.status(204).end()
        })
        .catch(error => {
            logger.error('Error:', error.message)
        })
})

notesRouter.get('/:id', (req, res, next) => {
    // el metodo findById() permite obtener un recurso individual a traves de su id
    Note.findById(req.params.id)
        .then(result => {
            res.json(result)
        })
        .catch(error => next(error))
})

module.exports = notesRouter