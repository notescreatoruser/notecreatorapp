import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './NoteEditor.css';

class NoteEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: props.initialNote || '',
        };
    }

    saveNote = (event) => {
        if (!event || !event.target) {
            throw new Error("addNote: illegal inputs");
        }
        event.preventDefault();
        // I assume here add note succeeds, for simplicity. 
        if (typeof this.props.onNoteSave === 'function') {
            this.props.onNoteSave(this.state.note);
        }
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
                <div className="note-editor-title">
                    { this.props.title }
                </div>
                <textarea 
                    className="note-input"
                    value={this.state.note}
                    onChange={this.onNoteChange}
                    rows="4"
                    cols="80"
                    placeholder={this.props.placeholder}
                    // autoFocus does not move the cursor to the end of a pre-existing text (scenario of note's update)
                    // TODO: move the cursor to the end programmatically
                />
                <button
                    type="button"
                    className="note-add"
                    onClick={this.saveNote}
                    disabled={!!this.props.disableOnEmpty && !this.state.note.length}
                > 
                    {this.props.saveButtonText || 'Save'}
                </button>
            </div>
        );
    }
}

export default NoteEditor;

NoteEditor.propTypes = {
    title: PropTypes.string,
    onNoteSave: PropTypes.func.isRequired,
    saveButtonText: PropTypes.string, 
    disableOnEmpty: PropTypes.bool,
    initialNote: PropTypes.string,
};