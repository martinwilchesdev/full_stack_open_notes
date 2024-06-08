// services
import noteService from './services/notes'

// components
import Notification from './components/Notification'
import NewNote from './components/NewNote'
import Note from './components/Note'

// hooks
import { useEffect, useState } from 'react'

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes)
        })
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

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <NewNote onHandleNewNote={handleNewNote} onHandleAddNote={addNote} />
            <ul>
                {notes.map((note) => (
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportance(note)}
                    />
                ))}
            </ul>
        </div>
    )
}

export default App
