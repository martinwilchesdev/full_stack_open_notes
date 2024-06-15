const express = require('express')
const cors = require('cors')
const app = express()

let notes = [
    {
        "id": 1,
        "content": "HTML is kwai",
        "important": false
    },
    {
        "id": 2,
        "content": "JS is easy",
        "important": false
    },
    {
        "id": 3,
        "content": "CSS is for styles",
        "important": true
    },
    {
        "id": 4,
        "content": "React is not a framework",
        "important": false
    }
]

app.use(express.json())

// Es posible permitir solicitudes de otros origenes utilizando el middleware cors de Node
app.use(cors())

/**
 * Para que Express muestre contenido estatico, una pagina index.html, JavaScript, etc, se utiliza el middleware integrado de Express llamado static.
 * Siempre que Express reciba peticiones GET, primero verificara si el directorio `dist` contiene un archivo correspondiente a la direccion de la solicitud, en caso de encontrarlo Express lo devolvera.
 * Las peticiones realizadas a la direccion `localhost:3001` mostraran el Frontend de React, mientras que las solicitudes GET realizadas a la direccion localhost:3001/api/notes seran manejadas por el backend.
*/
app.use(express.static('dist'))

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    singleNote = notes.find(note => note.id === Number(req.params.id))
    res.json(singleNote)
})

const PORT = process.env.PORT || 3001

app.listen(PORT)