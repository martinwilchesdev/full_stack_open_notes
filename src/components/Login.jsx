import { useState } from 'react'

// services
import loginService from '../services/login'
import noteService from '../services/notes'

const Login = ({ loginVisible, onHandleUser, onHandleErrorMessage }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsername = ({ target }) => setUsername(target.value)
    const handlePassword = ({ target }) => setPassword(target.value)

    const visibleLogin = { display: loginVisible ? 'block' : 'none' }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login(username, password)

            localStorage.setItem('loggedUserNotesApp', JSON.stringify(user))

            noteService.setToken(user.token)
            setUsername('')
            setPassword('')
            onHandleUser(user)
        } catch (e) {
            onHandleUser(null)
            onHandleErrorMessage('Wrong Credentials')
            setTimeout(() => {
                onHandleErrorMessage('')
            }, 3000)
        }
    }

    return (
        <form onSubmit={handleLogin} style={visibleLogin}>
            <div>
                <label>username:</label>
                <input onChange={handleUsername} value={username} />
            </div>
            <div>
                <label>password:</label>
                <input onChange={handlePassword} value={password} type="password" />
            </div>
            <button type="submit">login</button>
        </form>
    )
}

export default Login
