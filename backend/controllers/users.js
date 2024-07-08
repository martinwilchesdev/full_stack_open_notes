const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const logger = require('../utils/logger')
const User = require('../models/user')

usersRouter.post('/', async(req, res) => {
    const { username, name, password } = req.body

    const saltRounds = 10

    // Se almacena el hash de la contraseña enviada en la peticion, el cual se genera con la funcion bcrypt.hash()
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter
