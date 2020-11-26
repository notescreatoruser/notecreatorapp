import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './NoteEditor.css';

class NoteEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: props.initialNote || '',
            events: {
                list: [], 
                undoIndex: -1,
            },
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
    };

    applyUndoEvent = (event) => {
        if (!event) {
            throw new Error("applyEvent: illegal input");
        }
        console.log('applyEvent on event = ', event);
        if (event.keyCode >= 33 && event.keyCode <= 126) {
            const note = this.state.note;
            const newNote = note.substring(0, event.location) + note.substring(event.location + 1);
            this.setState({note: newNote});
            return;
        }
        if (event.keyCode === 8) {
            const note = this.state.note;
            const newNote = note.substring(0, event.location) + String.fromCharCode(event.keyCode) + note.substring(event.location);
            this.setState({note: newNote});
            return;
        }
    };

    applyRedoEvent = (event) => {
        if (!event) {
            throw new Error("applyEvent: illegal input");
        }
        console.log('applyEvent on event = ', event);
        if (event.keyCode >= 33 && event.keyCode <= 126) {
            const note = this.state.note;
            const newNote = note.substring(0, event.location) + event.key + note.substring(event.location + 1);
            this.setState({note: newNote});
            return;
        }
        if (event.keyCode === 8) {
            const note = this.state.note;
            const newNote = note.substring(0, event.location) + String.fromCharCode(event.keyCode) + note.substring(event.location);
            this.setState({note: newNote});
            return;
        }
    };

    onUndo = (event) => {
        if (!event || !event.target) {
            throw new Error("onUndo: illegal input");
        }
        event.preventDefault();
        console.log('state.events = ', this.state.events);
        if (this.state.events.list.length) {
            const undoIndex = this.state.events.undoIndex;
            this.applyUndoEvent(this.state.events.list[undoIndex]);
            this.setState((previous) => {
                const newState = {...previous};
                newState.events.undoIndex = undoIndex - 1;
                console.log('newState.events = ', newState.events);
                return newState;
            });
        }
    }

    onRedo = (event) => {
        if (!event || !event.target) {
            throw new Error("onRedo: illegal input");
        }
        event.preventDefault();
        if (this.state.events.list.length) {
            const redoIndex = this.state.events.undoIndex + 1;
            this.applyRedoEvent(this.state.events.list[redoIndex]);
            this.setState((previous) => {
                const newState = {...previous};
                newState.events.undoIndex = redoIndex;
                return newState;
            });
        }
    }

    onNoteChange = (event) => {
        if (!event || !event.target) {
            throw new Error("onNoteChange: illegal inputs");
        }
        event.preventDefault();
        this.setState({
            note: event.target.value,
        });
    };

    onNoteKeyDown = (event) => {
        if (!event || !event.target) {
            throw new Error("onNoteKeyDown: illegal inputs");
        }
        console.log('onNoteKeyDown: ', event);
        // console.log('onNoteKeyDown location: ', this.noteTextareaRef.current.selectionStart, ' ', this.noteTextareaRef.current.selectionEnd);
        const location = this.noteTextareaRef.current.selectionStart === this.noteTextareaRef.current.selectionEnd ? this.noteTextareaRef.current.selectionStart : null;

        if ((event.keyCode >= 33 && event.keyCode <= 126) || event.keyCode === 8) {
            const keyEvent = {
                keyCode: event.keyCode,
                key: event.key,
                location: location,
            };
            this.setState((previous) => {
                const newList = [...previous.events.list];
                let undoIndex = newList.length - 1;
                newList.push(keyEvent);
                undoIndex++;
                return {
                    ...previous,
                    events: {
                        list: newList, 
                        undoIndex,
                    },
                };
            });
        } else {
            this.setState((previous) => {
                const newList = [...previous.events.list];
                newList.slice(0, previous.events.undoIndex + 1);
                return {
                    ...previous, 
                    events: {
                        list: newList,
                        undoIndex: previous.events.undoIndex,
                    },
                };
            });
        } 
    };

    setFocus = () => {
        const element = this.noteTextareaRef;
        if (element && element.current) {
            element.current.focus();
            // Move the cursor to the end of any pre-existing text.
            element.current.setSelectionRange(element.current.value.length, element.current.value.length);
        }
    };

    componentDidMount() {
        this.setFocus();
    }

    render() {
        return (
            <div className="note-editor-container">
                <div className="note-editor-title">
                    {this.props.title}
                </div>
                <div className="note-editor-input-controls">
                    <textarea 
                        className="note-input"
                        value={this.state.note}
                        onChange={this.onNoteChange}
                        rows="4"
                        cols="80"
                        placeholder={this.props.placeholder}
                        ref={this.noteTextareaRef}
                        // "autoFocus" does not move the cursor to the end of a pre-existing text (in a scenario of note's update)
                        onKeyDown={this.onNoteKeyDown}
                    />
                    <div className="note-editor-buttons">
                        <button className="note-editor-button-undo" 
                            type="button"
                            onClick={this.onUndo}
                            disabled={this.state.events.undoIndex === -1}
                        >
                            Undo
                        </button>
                        <button className="note-editor-button-redo" 
                            type="button"
                            onClick={this.onRedo}
                            disabled={this.state.events.undoIndex === this.state.events.list.length - 1}
                        >
                            Redo
                        </button>
                        <button
                            type="button"
                            className="note-editor-button-save"
                            onClick={this.saveNote}
                            disabled={this.props.disableOnEmpty && !this.state.note.length}
                        > 
                            {this.props.saveButtonText || 'Save'}
                        </button>
                    </div>
                </div>

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
