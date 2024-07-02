const helper = require('./test_helper')
const app = require('../app')

const Note = require('../models/notes')

const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const assert = require('node:assert')

const mongoose = require('mongoose')

const api = supertest(app)

test('there are two notes', async() => {
    const response = await api.get('/api/notes')
    
    assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test('the first note is about HTTP methods', async() => {
    const response = await api.get('/api/notes')

    const content = response.body.map(e => e.content)
    assert(content.includes('HTML is easy'), true)
})

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('a valid note can be added', async() => {
    const newNote = {
        content: 'async/await simplified asynchronous tasks',
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    const contents = notesAtEnd.body.map(r => r.content)

    assert.strictEqual(notesAtEnd.body.length, helper.initialNotes.length + 1)
    assert(contents.includes('async/await simplified asynchronous tasks'))
})

test('note without content is added', async() => {
    const newNote = {
        content: '',
        important: false
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

    const notesAtEnd = await helper.notesInDb()

    assert.strictEqual(notesAtEnd.body.length, helper.initialNotes.length)
})

after(async () => { 
    await mongoose.connection.close()
})

beforeEach(async() => {
    await Note.deleteMany({})

    let noteObject = await Note(helper.initialNotes[0])
    await noteObject.save()
    
    noteObject = await Note(helper.initialNotes[1])
    await noteObject.save()
})