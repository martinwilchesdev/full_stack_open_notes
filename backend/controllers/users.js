const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.get('/', async(req, res) => {
    /**
     * El metodo populate se encadena despues de que el metodo find() realiza la consulta inicial.
     * El argumento recibido por el metodo populate define que los ids que hacen referencias a objetos note en el campo notes del documentos user, seran reemplazados por los documentos de note referenciados.
     * El metodo populate puede recibir un segundo parametro para elegir los campos que se quieron incluir de los documentos.
     *      populate('notes', {content: 1, important: 1})
    */
    const users = await User.find({}).populate('notes', {content: 1, important: 1})

    res.json(users)
})

usersRouter.post('/', async(req, res) => {
    const { username, name, password } = req.body

    const saltRounds = 10

    /**
     * Se almacena el hash de la contraseña enviada en la peticion, el cual se genera con la funcion bcrypt.hash().
     * El primer parametro que recibe la funcion es la contraseña a encriptar, el segundo parametro que recibe es la variable saltRounds.
    */
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        password: passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter
