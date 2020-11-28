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
            events: {
                list: [], 
                undoIndex: -1,
            },
        });
    };

    applyUndoEvent = (event) => {
        if (!event) {
            throw new Error("applyEvent: illegal input");
        }
        if (event.keyCode >= 32 && event.keyCode <= 126) {
            const note = this.state.note;
            const newNote = note.substring(0, event.location) + note.substring(event.location + 1);
            this.setState({note: newNote});
            return event.location;
        }
        if (event.keyCode === 8) {
            const note = this.state.note;
            const newNote = note.substring(0, event.location) + event.key + note.substring(event.location);
            this.setState({note: newNote});
            return event.location + 1;
        }
    };

    applyRedoEvent = (event) => {
        if (!event) {
            throw new Error("applyEvent: illegal input");
        }
        if (event.keyCode >= 32 && event.keyCode <= 126) {
            const note = this.state.note;
            const newNote = note.substring(0, event.location) + event.key + note.substring(event.location);
            this.setState({note: newNote});
            return event.location + 1;
        }
        if (event.keyCode === 8) {
            const note = this.state.note;
            const newNote = note.substring(0, event.location) + note.substring(event.location + 1);
            this.setState({note: newNote});
            return event.location;
        }
    };

    logUndoEvents = () => {
        console.log('this.state.events = ', this.state.events);
    };

    onUndo = (event) => {
        if (!event || !event.target) {
            throw new Error("onUndo: illegal input");
        }
        event.preventDefault();
        if (this.state.events.list.length) {
            const undoIndex = this.state.events.undoIndex;
            const location = this.applyUndoEvent(this.state.events.list[undoIndex]);
            this.setState((previous) => {
                const newState = {...previous};
                newState.events.undoIndex = undoIndex - 1;
                return newState;
            }, () => this.setFocus(location, location));
        }
    };

    onRedo = (event) => {
        if (!event || !event.target) {
            throw new Error("onRedo: illegal input");
        }
        event.preventDefault();
        if (this.state.events.list.length) {
            const redoIndex = this.state.events.undoIndex + 1;
            const location = this.applyRedoEvent(this.state.events.list[redoIndex]);
            this.setState((previous) => {
                const newState = {...previous};
                newState.events.undoIndex = redoIndex;
                return newState;
            }, () => this.setFocus(location, location));
        }
    };

    onNoteChange = (event) => {
        if (!event || !event.target) {
            throw new Error("onNoteChange: illegal inputs");
        }
        event.preventDefault();
        this.setState({
            note: event.target.value,
        });
    };

    logUndoStack = () => {
        console.log('undoStack = ', this.state.events);
    };

    onNoteKeyDown = (event) => {
        if (!event || !event.target) {
            throw new Error("onNoteKeyDown: illegal inputs");
        }

        // Currently support only one character editing: 
        if (this.noteTextareaRef.current.selectionStart !== this.noteTextareaRef.current.selectionEnd) {
            this.setState((previous) => {
                return {
                    ...previous, // Technically, not needed. 
                    events: {
                        list: [],
                        undoIndex: -1,
                    },
                };
            });
            return;
        } 

        const location = this.noteTextareaRef.current.selectionStart;
         if ((event.keyCode >= 32 && event.keyCode <= 126) || event.keyCode === 8) {
            // Range of supported printable characters and backspace. 
            const keyEvent = {
                keyCode: event.keyCode,
                key: (event.keyCode >= 32 && event.keyCode <= 126) ? event.key : this.state.note[this.noteTextareaRef.current.selectionStart-1],
                location: (event.keyCode >= 32 && event.keyCode <= 126) ? location : location - 1,
            };
            // Click a key cuts off any outstanding redo events.
            this.setState((previous) => {
                const currentUndoIndex = previous.events.undoIndex;
                const list = [...previous.events.list.slice(0, currentUndoIndex + 1), keyEvent];
                const undoIndex = list.length - 1;
                return {
                    ...previous, // Technically, not needed. 
                    events: {
                        list, 
                        undoIndex,
                    },
                };
            });
        } else {
            this.setState((previous) => {
                return {
                    ...previous, // Technically, not needed. 
                    events: {
                        list: previous.events.list.slice(0, previous.events.undoIndex + 1),
                        undoIndex: previous.events.undoIndex,
                    },
                };
            });
        } 
    };

    setFocus = (selectionStart, selectionEnd) => {
        const element = this.noteTextareaRef;
        if (element && element.current) {
            element.current.focus();
            if (!selectionStart) {
                selectionStart = 0;
            }
            if (!selectionEnd) {
                selectionEnd = element.current.value.length;
            }
            element.current.setSelectionRange(selectionStart, selectionEnd);
        }
    };

    // isSupportedEvent = (event) => {
    //     const isPrintableCharacter = event.key.length === 1 && !!event.key.match(/[a-zA-Z0-9]/g);
    //     const isBackSpace = event.key.toLowerCase() === 'backspace';
    //     const isSpace = event.key === ' ';
    //     const isSupported = (isPrintableCharacter || isBackSpace || isSpace);
    //     console.log('key = ', event.key, ' , isSupported = ', isSupported);
    //     return isSupported;
    // }

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
                        <button
                            type="button"
                            className="note-editor-button-undo" 
                            onClick={this.onUndo}
                            disabled={this.state.events.undoIndex === -1}
                        >
                            Undo
                        </button>
                        <button 
                            type="button"
                            className="note-editor-button-redo" 
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
