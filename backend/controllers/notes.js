const notesRouter = require('express').Router()
const Note = require('../models/notes')

notesRouter.get('/', async(req, res) => {
    const notes = await Note.find({})
    res.json(notes)
})

notesRouter.post('/', (req, res) => {
    const body = req.body?.content

    if (body) {
        const note = new Note({
            content: body,
            important: body.important || false
        })

        note.save()
            .then(result => {
                console.log('note saved')
                res.json(result)
            })
            .catch(error => {
                res.status(400).json({error: "the note cannot be saved"})
            })
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
                console.log('note updated')
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
            console.log('note deleted')
            res.status(204).end()
        })
        .catch(error => {
            console.log('Error:', error.message)
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