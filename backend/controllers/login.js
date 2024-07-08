const loginRouter = require('express').Router()

const User = require('../models/user')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body

    // se busca al usuario en la base de datos mediante el username proporcionado en el cuerpo de la peticion
    const user = await User.findOne({ username })

    // se valida que la password indicada en la peticion coincida con la almacenada en la base de datos para el usuario
    const validPassword = user === null 
        ? false 
        : await bcrypt.compare(password, user.password)

    // Si la contraseña es incorrecta, se retorna como respuesta un codigo de estado HTTP 401 unauthorized
    if (!validPassword) {
        return res.status(401).json({error: 'invalid username or password'})
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    res.status(200).send({token, username: user.username, name: user.name})
})
    
module.exports = loginRouter