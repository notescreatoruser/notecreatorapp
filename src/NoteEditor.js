import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './NoteEditor.css';

class NoteEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: props.initialNote || '',
        };
        this.noteTextareaRef = React.createRef();
    }

    saveNote = (event) => {
        if (!event) {
            throw new Error("saveNote: illegal inputs");
        }
        event.preventDefault();
        if (typeof this.props.onNoteSave === 'function') {
            // Assume here saving a note always succeeds, for simplicity. 
            this.props.onNoteSave(this.state.note);
        }
        this.setState({
            note: '',
        });
    }

    onNoteChange = (event) => {
        if (!event || !event.target) {
            throw new Error("onNoteChange: illegal inputs");
        }
        event.preventDefault();
        this.setState({
            note: event.target.value,
        });
    }

    componentDidMount() {
        // Move the cursor to the end of any pre-existing text.
        const element = this.noteTextareaRef;
        if (element && element.current) {
            element.current.focus();
            element.current.setSelectionRange(element.current.value.length, element.current.value.length);
        }
    }

    render() {
        return (
            <div className="note-editor-container">
                <div className="note-editor-title">
                    {this.props.title}
                </div>
                <textarea 
                    className="note-input"
                    value={this.state.note}
                    onChange={this.onNoteChange}
                    rows="4"
                    cols="80"
                    placeholder={this.props.placeholder}
                    ref={this.noteTextareaRef}
                    // "autoFocus" does not move the cursor to the end of a pre-existing text (in a scenario of note's update)
                >
                </textarea>
                <button
                    type="button"
                    className="note-add"
                    onClick={this.saveNote}
                    disabled={this.props.disableOnEmpty && !this.state.note.length}
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
