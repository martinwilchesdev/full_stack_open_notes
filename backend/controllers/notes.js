const notesRouter = require('express').Router()
const logger = require('../utils/logger')
const Note = require('../models/notes')

notesRouter.get('/', async(req, res) => {
    const notes = await Note.find({})

    res.json(notes)
})

notesRouter.post('/', async(req, res) => {
    const body = req.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    const savedNote = await note.save()

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