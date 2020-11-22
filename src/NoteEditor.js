import React, { Component } from 'react';
import './NoteEditor.css';

class NoteEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: this.props.initialNote || '',
        };
    }

    saveNote = (event) => {
        if (!event || !event.target) {
            throw new Error("addNote: illegal inputs");
        }
        event.preventDefault();
        // I assume here add note succeeds, for simplicity. 
        this.props.onNoteSave(this.state.note);
        this.setState({
            note: '',
        });
    }

    onNoteChange = (event) => {
        if (!event || !event.target) {
            throw new Error("onNoteChage: illegal inputs");
        }
        event.preventDefault();
        this.setState({
            note: event.target.value,
        });
    }

    render() {
        return (
            <div className="note-editor-container">
                <textarea 
                    className="note-input"
                    value={this.state.note}
                    onChange={this.onNoteChange}
                    rows="4"
                    cols="80"
                    placeholder={this.props.placeholder}
                    // autoFocus does not move the cursor to the end of pre-existing text
                    // TODO: move the cursor to the end programmatically
                />
                <button
                    type="button"
                    className="note-add"
                    onClick={this.saveNote}
                    disabled={!!this.props.disableOnEmpty && !this.state.note.length}
                > 
                    {this.props.saveButtonText}
                </button>
            </div>
        );
    }
}

export default NoteEditor;