const helper = require('./test_helper')
const app = require('../app')

const Note = require('../models/notes')

const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const assert = require('node:assert')

const mongoose = require('mongoose')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
    beforeEach(async() => {
        await Note.deleteMany({})
        await Note.insertMany(helper.initialNotes)
    })

    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async() => {
        const notesResult = await api.get('/api/notes')

        assert.strictEqual(notesResult.body.length, helper.initialNotes.length)
    })

    test('a especific note is within the returned notes', async() => {
        const notesResult = await api.get('/api/notes')
        const contents = notesResult.body.map(note => note.content)

        assert(contents.includes('Browser can execute only JavaScript'))
    })
})

describe('viewing a specific note', () => {
    test('succeeds with a valid id', async() => {
        const notesAtStart = await helper.notesInDb()
        const noteToView = notesAtStart[0]

        const notesResult = await api.get(`/api/notes/${noteToView.id}`)

        assert.deepStrictEqual(notesResult.body, noteToView)
    })

    test('fails with status code 404 if note does not exist', async() => {
        const notExistingNote = await helper.nonExistingId()

        await api
            .get(`/api/notes/${notExistingNote}`)
            .expect(404)
    })

    test('fails with status code 400 if id is invalid', async() => {
        const invalidId = '123456'

        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400)
    })
})

describe('addition of a new note', () => {
    test('succeeds with a valid data', async() => {
        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()
        const contents = notesAtEnd.map(note => note.content)

        assert(contents.includes('async/await simplifies making async calls'))
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)
    })

    test('fails with status code 400 if data is invalid', async() => {
        const notesAtStart = await helper.notesInDb()

        const newNote = {
            important: false
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)

        const notesAtEnd = await helper.notesInDb()

        assert.strictEqual(notesAtEnd.length, notesAtStart.length)
    })
})

describe('deletion a note', () => {
    test('succeeds with status code 204 if id is valid', async() => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        await api
            .delete(`/api/notes/${noteToDelete.id}`)
            .expect(204)

        const notesAtEnd = await helper.notesInDb()
        const contents = notesAtEnd.map(note => note.content)

        assert.strictEqual(notesAtEnd.length, notesAtStart.length - 1)
        assert(!contents.includes(notesAtStart.content))
    })
})

after(async () => {
    await mongoose.connection.close()
})