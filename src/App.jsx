// services
import loginService from './services/login'
import noteService from './services/notes'

// components
import Notification from './components/Notification'
import NewNote from './components/NewNote'
import Login from './components/Login'
import Note from './components/Note'

// hooks
import { useEffect, useState } from 'react'

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    // login state
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes)
        })
    }, [])

    // validar al ingresar a la aplicacion si existe una sesion de usuario activa
    useEffect(() => {
        const loggedUserJSON = localStorage.getItem('loggedUserNotesApp')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            noteService.setToken(user.token)
            setUser(user)
        }
    }, [])

    const handleNewNote = (event) => {
        setNewNote(event.target.value)
    }

    const addNote = (event) => {
        event.preventDefault()

        noteService
            .create({
                content: newNote,
                important: Math.random() < 0.5
            })
            .then((newNote) => {
                setNotes(notes.concat(newNote))
                setNewNote('')
            })
    }

    const toggleImportance = (note) => {
        noteService
            .update({
                ...note,
                important: !note.important
            })
            .then((newNote) => {
                setNotes(notes.map((n) => (n.id == note.id ? newNote : n)))
            })
            .catch(error => {
                setErrorMessage(
                    `Note ${note.content} was already removed from the server`
                )
                setTimeout(() => {
                    setErrorMessage('')
                }, 3000);
                setNotes(notes.filter(n => n.id != note.id))
            })
    }

    const deleteNote = (note) => {
        noteService.remove(note.id)
            .then(status => {
                if (status === 204) {
                    setNotes(notes.filter(n => n.id != note.id))
                }
            })
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login(username, password)

            localStorage.setItem('loggedUserNotesApp', JSON.stringify(user))

            noteService.setToken(user.token)
            setUsername('')
            setPassword('')
            setUser(user)
        } catch (e) {
            setErrorMessage('Wrong Credentials')
            setTimeout(() => {
                setErrorMessage('')
            }, 3000)
        }
    }

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            {
                user === null ?
                    <Login
                        onHandleLogin={handleLogin}
                        onHandleUserName={setUsername}
                        onHandlePassword={setPassword}
                        username={username}
                        password={password}
                    /> :
                    <div>
                        <p>{user.name} logged-in</p>
                        <NewNote
                            onHandleNewNote={handleNewNote}
                            onHandleAddNote={addNote}
                            newNote={newNote}
                        />
                    </div>
            }
            <ul>
                {notes.map((note) => (
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportance(note)}
                        deleteNote={() => deleteNote(note)}
                    />
                ))}
            </ul>
        </div>
    )
}

export default App