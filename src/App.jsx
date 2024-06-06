import NewNote from './components/NewNote'
import Note from './components/Note'

import axios from 'axios'
import { useEffect, useState } from 'react'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        setNotes(notes.concat(response.data))
      })
  }, [])

  const handleNewNote = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        console.log(response)
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <NewNote onHandleNewNote={handleNewNote} onHandleAddNote={addNote} />
      <ul>
        {notes.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}

export default App