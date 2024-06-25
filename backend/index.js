const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')

const Note = require('../models')
const cors = require('cors')

// app.use(cors())
// app.use(express.json())
// app.use(express.static('dist'))

// notesRouter.get('/api/notes', (req, res) => {
//     Note.find({})
//         .then(notes => {
//             res.json(notes)
//         })
// })

// notesRouter.get('/api/notes', (req, res) => {
//     Note.find({})
//         .then(notes => {
//             res.json(notes)
//         })
// })

// app.post('/api/notes', (req, res) => {
//     const body = req.body?.content

//     if (body) {
//         const note = new Note({
//             content: body,
//             important: body.important || false
//         })

//         note.save()
//             .then(result => {
//                 console.log('note saved')
//                 res.json(result)
//             })
//             .catch(error => {
//                 res.status(400).json({error: "the note cannot be saved"})
//             })
//     } else {
//         res.status(400).json({error: "content field is required"})
//     }
// })

// app.put('/api/notes/:id', (req, res) => {
//     const note = {
//         content: req.body.content,
//         important: req.body.important
//     }

//     /**
//      * El metodo findIdAndUpdate permite obtener un recurso individual a traves de su id y posteriormente actualizarlo.
//      * El metodo findIdAndUpdate() rebibe como segundo argumento un objeto JavaScript en lugar de un objeto creado con el modelo Note.
//     */
//     Note.findByIdAndUpdate(req.params.id, note, {new: true})
//         .then(response => {
//             // El argumento {new: true} permite que la respuesta obtenga el nuevo documento modificado en lugar del original sin modificaciones
//             if (response) {
//                 console.log('note updated')
//                 res.json(response)
//             } else {
//                 res.status(500).end()
//             }
//         })
// })

// app.delete('/api/notes/:id', (req, res) => {
//     // el metodo findByIdAndDelete permite obtener un recurso individual a traves de su id y posteriormente eliminarlo
//     Note.findByIdAndDelete(req.params.id)
//         .then(result => {
//             console.log('note deleted')
//             res.status(204).end()
//         })
//         .catch(error => {
//             console.log('Error:', error.message)
//         })
// })

// app.get('/api/notes/:id', (req, res) => {
//     // el metodo findById() permite obtener un recurso individual a traves de su id
//     Note.findById(req.params.id)
//         .then(result => {
//             res.json(result)
//         })
// })

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})