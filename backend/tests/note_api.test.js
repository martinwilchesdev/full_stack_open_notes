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
    const contents = notesAtEnd.map(r => r.content)

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)
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

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
})

test('a specific note can be viwed', async() => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultNote.body, noteToView)
})

test('a specific note can be deleted', async() => {
    const notesAtStart = await helper.notesInDb()
    const noteDeleted = notesAtStart[0]

    await api
        .delete(`/api/notes/${noteDeleted.id}`)
        .expect(204)

    const notesAtEnd = await helper.notesInDb()

    assert(!notesAtEnd.includes(noteDeleted))
    assert.strictEqual(notesAtEnd.length, notesAtStart.length - 1)
})

after(async () => {
    await mongoose.connection.close()
})

beforeEach(async() => {
    await Note.deleteMany({})

    const noteObjects = helper.initialNotes.map(note => new Note(note))
    const notesSaved = noteObjects.map(note => note.save())
    await Promise.all(notesSaved)
})