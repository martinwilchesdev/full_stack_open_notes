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

    /**
     * Si la contraseña es correcta se crea un TOKEN con el metodo jwt.sign().
     * El TOKEN contiene el nombre de usuario y la id de usuario en un formato firmado digitalmente.
     * El valor de la variable de entorno SECRET puede ser cualquier string.
    */
    const token = jwt.sign(userForToken, process.env.SECRET)

    /**
     * El TOKEN ha sido firmado digitalmente usando una cadena de variable de entorno `SECRET`.
     * La firma digital permite que solo las partes que conocen el secreto puedan generar un TOKEN valido.
    */

    // Una solicitud exitosa de login se responde con el codigo de estado 200 OK, el token generado, el username y el name del usuario
    res.status(200).send({token, username: user.username, name: user.name})
})

module.exports = loginRouter