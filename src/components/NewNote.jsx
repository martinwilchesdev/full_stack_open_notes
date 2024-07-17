import { useState } from 'react'

// servicios
import noteService from '../services/notes'

const NewNote = ({ onHandleNotes, notes }) => {
    const [newNote, setNewNote] = useState('')

    const addNote = (event) => {
        event.preventDefault()

        noteService
            .create({
                content: newNote,
                important: Math.random() < 0.5
            })
            .then((newNote) => {
                onHandleNotes(notes.concat(newNote))
                setNewNote('')
            })
    }

    const handleNewNote = ({ target }) => {
        setNewNote(target.value)
    }

    return (
        <div>
            <input onChange={handleNewNote} value={newNote} />
            <button onClick={addNote}>add note</button>
        </div>
    )
}

export default NewNote