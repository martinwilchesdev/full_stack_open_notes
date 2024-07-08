const { beforeEach, test, describe, after } = require('node:test')

const bcrypt = require('bcrypt')

const User = require('../models/user')
const app = require('../app')

const supertest = require('supertest')
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async() => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', password: passwordHash})

        await user.save()

        console.log(await User.find({}))
    })
})