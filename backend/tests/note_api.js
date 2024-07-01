const Note = require('../models/notes')
const app = require('../app')

const supertest = require('supertest')

const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')

const api = supertest(app)

const initialNotes = [
    {
        content: 'HTML is easy',
        important: false
    },
    {
        content: 'Browser can execute only JavaScript',
        important: true
    }
]

test('there are two notes', async() => {
    const response = await api.get('/api/notes')
    
    assert.strictEqual(response.body.length, initialNotes.length)
})

test('the first note is about HTTP methods', async() => {
    const response = await api.get('/api/notes')

    const content = response.body.map(e => e.content)

    // Se puede simplificar la prueba utilizando unicamente el metodo assert, cuando se comprueban 2 valores booleanos 
    assert(content.includes('HTML is easy'), true)
})

/**
 * Las pruebas anteriores almacenan la respuesta de la solicitud en la variable response, para posteriormente almacenar los datos de respuesta almacenados en la propiedad body.
*/

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})

/**
 * La funcion beforeEach() inicializa la base de datos antes de cada prueba.
 * La base de datos se borra y luego se guardan las 2 notas almacenadas en el array initialNotes.
*/
beforeEach(async() => {
    await Note.deleteMany({})
    let noteObject = await Note(initialNotes[0])
    await noteObject.save()
    noteObject = await Note(initialNotes[1])
    await noteObject.save()
})