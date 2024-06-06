const NewNote = ({ onHandleNewNote, onHandleAddNote }) => {
    return (
        <div>
            <input onChange={onHandleNewNote} />
            <button onClick={onHandleAddNote}>add note</button>
        </div>
    )
}

export default NewNote