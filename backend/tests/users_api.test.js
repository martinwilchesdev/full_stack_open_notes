const { beforeEach, test, describe, after } = require('node:test')
const assert = require('node:assert')

const bcrypt = require('bcrypt')

const helper = require('./helpers/user_helper')
const User = require('../models/user')
const app = require('../app')

const supertest = require('supertest')
const api = supertest(app)

const mongoose = require('mongoose')

describe('when there is initially one user in db', () => {
    beforeEach(async() => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'dustinthewind', password: passwordHash, name: 'dust'})

        await user.save()
    })

    test('creation succeeds with a fresh username', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Lukkainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        const users = usersAtEnd.map(user => user.username)

        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        assert(users.includes(newUser.username))
    })

    test('creation fails with proper status code and message if username already taken', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'dustinthewind',
            password: 'Aa123456.',
            name: 'saainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        assert(result.body.error.includes('expected `username` to be unique'))
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    after(async() => {
        await mongoose.connection.close()
    })
})