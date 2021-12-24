import React, { useState, useEffect, useRef } from "react";
import { useGlobalContext } from "../context";
import ButtonInline from "./ButtonInline";
import { ref, update } from "firebase/database";
import { FaTrash, FaChevronUp, FaChevronDown } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";

function Note({ data }) {
    const { noteId, db, latestNote } = data;
    const { user, notes, setNotes, settings } = useGlobalContext();

    const noteFocus = useRef(null);

    const [noteText, setNoteText] = useState(
        notes[settings.noteCategory][noteId]
    );

    // Update note value
    const handleNoteChange = (e) => {
        const currentValue = e.target.value;
        setNoteText(currentValue);
        const updates = {};
        updates[
            "/users/" +
                user.uid +
                "/notes/" +
                settings.noteCategory +
                "/" +
                noteId
        ] = currentValue;
        update(ref(db), updates);
        setNotes({
            ...notes,
            [settings.noteCategory]: {
                ...notes[settings.noteCategory],
                [noteId]: currentValue,
            },
        });
    };
    // Handle special inputs
    const handleKeyDown = (e) => {
        const startPos = e.target.selectionStart;
        let text = e.target;
        if (e.key === "Tab") {
            // Case for "Tab"
            text.value =
                text.value.slice(0, startPos) +
                "\t" +
                text.value.slice(startPos);
            e.preventDefault();
            text.setSelectionRange(
                startPos + "\t".length,
                startPos + "\t".length
            );
        } else if (e.key === " " && text.value[startPos - 1] == "*") {
            // Case for "Bullet Point"
            text.value =
                text.value.slice(0, startPos - 1) +
                " \u25CF " +
                text.value.slice(startPos);
            e.preventDefault();
            text.setSelectionRange(
                startPos + "\t".length + 1,
                startPos + "\t".length + 1
            );
        } else if (e.key === ">" && text.value[startPos - 1] == "-") {
            // Case for "Right Arrow"
            text.value =
                text.value.slice(0, startPos - 1) +
                "\u1405" +
                text.value.slice(startPos);
            e.preventDefault();
            text.setSelectionRange(
                startPos + "\t".length - 1,
                startPos + "\t".length - 1
            );
        } else if (e.key === "-" && text.value[startPos - 1] == "<") {
            // Case for "Left Arrow"
            text.value =
                text.value.slice(0, startPos - 1) +
                "\u140a" +
                text.value.slice(startPos);
            e.preventDefault();
            text.setSelectionRange(
                startPos + "\t".length - 1,
                startPos + "\t".length - 1
            );
        } else if (e.key === "-" && text.value[startPos - 1] == "+") {
            // Case for "Plus or Minus"
            text.value =
                text.value.slice(0, startPos - 1) +
                "\u00b1" +
                text.value.slice(startPos);
            e.preventDefault();
            text.setSelectionRange(
                startPos + "\t".length - 1,
                startPos + "\t".length - 1
            );
        } else if (e.key === "3" && text.value[startPos - 1] == "<") {
            // Case for "Heart"
            text.value =
                text.value.slice(0, startPos - 1) +
                "\u2665" +
                text.value.slice(startPos);
            e.preventDefault();
            text.setSelectionRange(
                startPos + "\t".length - 1,
                startPos + "\t".length - 1
            );
        } else if (e.key === ")" && text.value[startPos - 1] == ":") {
            // Case for "Smile"
            text.value =
                text.value.slice(0, startPos - 1) +
                "\u263a" +
                text.value.slice(startPos);
            e.preventDefault();
            text.setSelectionRange(
                startPos + "\t".length - 1,
                startPos + "\t".length - 1
            );
        }
        handleNoteChange(e);
    };

    const handleMoveNote = (direction) => {
        // Initialize temporary variables
        let clickedIndex;
        let newIndex;
        let tempValue;
        let noteEntries = Object.entries(notes[settings.noteCategory]);

        // Get index of clicked note
        noteEntries.forEach((element) => {
            if (element[0] === noteId) {
                clickedIndex = noteEntries.indexOf(element);
            }
        });

        // Check if unable to move note
        if (
            (direction === "previous" && clickedIndex <= 0) ||
            (direction === "next" && clickedIndex >= noteEntries.length - 1)
        ) {
            console.log("Cannot move note any further");
            return;
        }

        // Check if move up or down
        direction === "next"
            ? (newIndex = clickedIndex + 1)
            : (newIndex = clickedIndex - 1);

        // Swap note values
        tempValue = noteEntries[clickedIndex][0];
        noteEntries[clickedIndex][0] = noteEntries[newIndex][0];
        noteEntries[newIndex][0] = tempValue;
        const newNotes = Object.fromEntries(noteEntries);
        // console.log(noteEntries);

        // Update notes
        const updates = {};
        updates["/users/" + user.uid + "/notes/" + settings.noteCategory] =
            newNotes;
        update(ref(db), updates);
        setNotes({
            ...notes,
            [settings.noteCategory]: newNotes,
        });
    };

    // Set focus on newly created notes
    useEffect(() => {
        if (latestNote === noteId) {
            noteFocus.current.focus();
        }
    }, [latestNote, noteId]);

    return (
        <div className='bg-midground rounded-md overflow-hidden animate-growfadein'>
            <div className='flex group'>
                <div className='flex flex-col lg:opacity-50 lg:group-hover:opacity-100 duration-150'>
                    <ButtonInline
                        height='50%'
                        onClick={() =>
                            handleMoveNote(
                                settings.notesReversed ? "previous" : "next"
                            )
                        }
                    >
                        <FaChevronUp />
                    </ButtonInline>
                    <ButtonInline
                        height='50%'
                        onClick={() =>
                            handleMoveNote(
                                settings.notesReversed ? "next" : "previous"
                            )
                        }
                    >
                        <FaChevronDown />
                    </ButtonInline>
                </div>
                <div className='p-3 flex-grow m-auto'>
                    <TextareaAutosize
                        className='bg-transparent py-2 w-full border-b-2 border-foreground focus:border-accent focus:outline-none resize-none m-auto'
                        value={noteText}
                        onChange={handleNoteChange}
                        onKeyDown={handleKeyDown}
                        ref={noteFocus}
                    ></TextareaAutosize>
                </div>
                <div className='flex lg:opacity-50 lg:group-hover:opacity-100 duration-150'>
                    <ButtonInline
                        onClick={() => {
                            const updates = {};
                            updates[
                                "/users/" +
                                    user.uid +
                                    "/notes/" +
                                    settings.noteCategory +
                                    "/" +
                                    noteId
                            ] = null;

                            update(ref(db), updates);
                            let tempNotes = { ...notes };
                            delete tempNotes[settings.noteCategory][noteId];
                            setNotes(tempNotes);
                        }}
                        hoverColor='hsl(0,50%,70%)'
                    >
                        <FaTrash />
                    </ButtonInline>
                </div>
            </div>
        </div>
    );
}

export default Note;
