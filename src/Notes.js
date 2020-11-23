import React, {Component} from 'react';
import NoteEditor from './NoteEditor';
import './Notes.css';
import './index.css';

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [], // array of note objects in format {id, text}
            nextId: 1,
            updateNoteId: null,
        };
    }

    addNote = (text) => {
        if (typeof text !== 'string' || !text) {
            throw new Error('updateNote: input errors');
        }
        const notes = [...this.state.notes];
        notes.push({
            id: this.state.nextId,
            text,
        });
        this.setState((previous) => ({
            notes,
            nextId: previous.nextId + 1,
        }));
    };

    setUpdateNote = (noteId) => {
        if (typeof noteId !== 'number') {
            throw new Error('setUpdateNote: input errors');
        }
        const notes = [...this.state.notes];
        const updatedNote = notes.find((note) => note.id === noteId);
        if (updatedNote) {
            this.setState({
                updateNoteId: noteId,
            });
        }
    }

    updateNote = (text) => {
        if (typeof text !== 'string') {
            throw new Error('updateNote: input errors');
        }
        const notes = [...this.state.notes];
        const updateNote = notes.find((note) => note.id === this.state.updateNoteId);
        if (!updateNote) {
            console.error('renderNoteEditorInModal invoked but could not find note to edit');
            return;
        }
        if (text) {
            updateNote.text = text;
            this.setState({
                notes,
                updateNoteId: null,
            });
        } else {
            // Updating a note to have no text effectively deletes it.
            this.deleteNote(this.state.updateNoteId);
        }
    };

    deleteNote = (noteId) => {
        if (typeof noteId !== 'number') {
            throw new Error('deleteNote: input errors');
        }
        this.setState((previous) => ({
            updateNoteId: null,
            notes: previous.notes.filter((note) => note.id !== noteId),
        }));
    };

    renderNoteUpdate = () => {
        const updateNote = this.state.notes.find((note) => note.id === this.state.updateNoteId);
        if (!updateNote) {
            console.error('renderNoteEditorInModal invoked but could not find note to edit');
            return;
        }
        return (
            <div className="overlay">
                <NoteEditor
                    title={`Update note # ${updateNote.id}`}
                    saveButtonText={"Update Note"}
                    onNoteSave={this.updateNote}
                    initialNote={updateNote.text}
                    disableOnEmpty={false}
                />
            </div>
        );
    }

    renderNoteCreate = () => {
        return (
            <>
                <NoteEditor 
                    title={"Create a new note"}
                    saveButtonText={"Create New Note"}
                    onNoteSave={this.addNote}
                    initialNote=""
                    placeholder={"Start your new note here ..."}
                    disableOnEmpty={true}
                />
                {
                    !!this.state.notes.length &&
                    <>
                        <div className="horizontal-seperator"/>
                        <div className="notes-list-title">Your saved notes</div>
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
                                                onClick={() => this.setUpdateNote(note.id)}
                                                className="note-button-edit"
                                            >
                                                Edit 
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
                    </>
                }
            </>
        );
    }

    render() {
        return (
            <div className="notes-app-container">
            {
                this.state.updateNoteId === null 
                    ? this.renderNoteCreate() 
                    : this.renderNoteUpdate()
            } 
            </div>
        );
    }
}

export default Notes;
