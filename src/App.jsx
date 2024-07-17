// services
import noteService from './services/notes'

// components
import ToggableButton from './components/ToggableButton'
import Notification from './components/Notification'
import NewNote from './components/NewNote'
import Login from './components/Login'
import Note from './components/Note'

// hooks
import { useEffect, useState } from 'react'

const App = () => {
    const [notes, setNotes] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const [loginVisible, setLoginVisible] = useState(false)

    // login state
    const [user, setUser] = useState(null)

    // validar al ingresar a la aplicacion si existe una sesion de usuario activa
    useEffect(() => {
        const loggedUserJSON = localStorage.getItem('loggedUserNotesApp')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            noteService.setToken(user.token)
            setUser(user)
        }
    }, [])

    useEffect(() => {
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes)
        })
    }, [])

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

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            {
                user === null ?
                    <ToggableButton
                        onHandleLoginVisible={setLoginVisible}
                        loginVisible={loginVisible}
                    >
                        <Login
                            onHandleErrorMessage={setErrorMessage}
                            loginVisible={loginVisible}
                            onHandleUser={setUser}
                        />
                    </ToggableButton> :
                    <div>
                        <p>{user.name} logged-in</p>
                        <NewNote
                            onHandleNotes={setNotes}
                            notes={notes}
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