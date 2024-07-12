const NewNote = ({ onHandleNewNote, onHandleAddNote, newNote }) => {
    return (
        <div>
            <input onChange={onHandleNewNote} value={newNote} />
            <button onClick={onHandleAddNote}>add note</button>
        </div>
    )
}

export default NewNote