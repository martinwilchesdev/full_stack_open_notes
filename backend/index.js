const express = require('express')
const cors = require('cors')
const app = express()

const notes = [
    {
        "id": "dce6",
        "content": "HTML is kwai",
        "important": false
    },
    {
        "id": "9d39",
        "content": "JS is easy",
        "important": false
    },
    {
        "id": "4988",
        "content": "CSS is for styles",
        "important": true
    },
    {
        "id": "891f",
        "content": "React is not a framework",
        "important": false
    }
]

app.use(express.json())

// Es posible permitir solicitudes de otros origenes utilizando el middleware cors de Node
app.use(cors())

app.get('/', (req, res) => {
    res.json({ content: 'Node.js' })
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

const PORT = process.env.PORT || 3001

app.listen(PORT)