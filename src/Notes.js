import React, {Component} from 'react';
import './Notes.css';

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [], // array of {id, text, editMode}
            newNote: '',
            nextId: 0,
        };
    }

    onNewNoteChange = (event) => {
        if (!event || !event.target) {
            throw new Error('onNewNoteChange: input errors');
        }
        event.preventDefault();
        this.setState({
            newNote: event.target.value,
        });
    }

    addNote = () => {
        const notes = [...this.state.notes];
        notes.push({
            id: this.state.nextId,
            text: this.state.newNote,
            editMode: false,
        });
        console.log('notes = ', notes);
        this.setState((previous) => ({
            ...previous,
            notes,
            nextId: previous.nextId + 1,
            newNote: '',
        }));
    }

    editNote = (noteId) => {
        if (typeof noteId !== 'number') {
            throw new Error('editNote: input errors');
        }
        const notes = [...this.state.notes];
        const editedNote = notes.find((note) => note.id === noteId);
        if (editedNote) {
            editedNote.editMode = !editedNote.editMode;
            this.setState({
                notes,
            });
        }
    }

    onEditNoteChange = (event, noteId) => {
        if (!event || !event.target || typeof noteId !== 'number') {
            throw new Error('onEditNoteChange: input errors');
        }
        event.preventDefault();
        const notes = [...this.state.notes];
        const editedNote = notes.find((note) => note.id === noteId);
        if (editedNote) {
            editedNote.text = event.target.value;
            this.setState({
                notes,
            });
        }
    }

    deleteNote = (noteId) => {
        if (typeof noteId !== 'number') {
            throw new Error('deleteNote: input errors');
        }
        this.setState((previous) => {
            return {
                ...previous, 
                notes: previous.notes.filter((note) => note.id !== noteId),
            }
        })
    }

    render() {
        return (
            <div className="notes-container">
                <div className="notes-input-container">
                    <textarea 
                        className="note-input"
                        value={this.state.newNote}
                        onChange={this.onNewNoteChange}
                        rows="4"
                        cols="80"
                        resize="none"
                        autoFocus
                        placeholder="Start your new note here"
                    />
                    <button
                        type="button"
                        className="note-add"
                        onClick={this.addNote}
                        disabled={!this.state.newNote}
                    > 
                        Create new note
                    </button>
                </div>
                <div className="notes-list">
                {
                    this.state.notes.map((note) => {
                        return (
                            <div key={note.id} className="note-container">
                                <div 
                                    className="note-text"
                                >
                                    {note.text}
                                </div>
                                <div className="note-buttons">
                                    <button
                                        type="button"
                                        onClick={() => this.editNote(note.id)}
                                        className="note-button-edit"
                                    >
                                        {note.editMode ? 'Editing....' : 'Edit'} 
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => this.deleteNote(note.id)}
                                        className="note-button-delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })
                }
                </div>
            </div>
        );
    }
}

export default Notes;