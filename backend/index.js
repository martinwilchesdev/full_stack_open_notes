const express = require('express')
const cors = require('cors')
const app = express()

// cargar las variables de entorno del archivo .env
process.loadEnvFile()

// modelo mongodb
const Note = require('./models/notes')

app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

app.get('/api/notes', (req, res) => {
    Note.find({})
        .then(notes => {
            res.json(notes)
        })
})

app.post('/api/notes', (req, res) => {
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

app.get('/api/notes/:id', (req, res) => {
    singleNote = notes.find(note => note.id === Number(req.params.id))
    res.json(singleNote)
})

const PORT = process.env.PORT

app.listen(PORT)