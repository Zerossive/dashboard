import React, { useState } from "react";
import { ref, update } from "firebase/database";
import Note from "./Note";
import Button from "./Button";
import { useGlobalContext } from "../context";
import { FaListUl, FaPlus } from "react-icons/fa";
import NotesDropdown from "./NotesDropdown";

function Notes(data) {
    const { db } = data;
    const { user, notes, setNotes, settings } = useGlobalContext();

    const [latestNote, setLatestNote] = useState("");
    const [showCategoryList, setShowCategoryList] = useState(false);

    const createNewNote = () => {
        // Set db item
        const newId = "note" + new Date().getTime();
        // set(ref(db, "users/" + user.uid + "/notes/" + newId), title);
        const updates = {};
        updates[
            "/users/" +
                user.uid +
                "/notes/" +
                settings.noteCategory +
                "/" +
                newId
        ] = "";
        update(ref(db), updates);
        setNotes({
            ...notes,
            [settings.noteCategory]: {
                ...notes[settings.noteCategory],
                [newId]: "",
            },
        });
        setLatestNote(newId);
    };

    return (
        <div
            className={`flex flex-wrap flex-col ${
                settings.notesReversed && ""
            } gap-6`}
        >
            {/* Add new note button */}
            <div className='flex justify-center gap-6'>
                {!settings.notesReversed && (
                    <Button onClick={createNewNote} width='100%' height='50px'>
                        <FaPlus />
                    </Button>
                )}
                <Button
                    height='50px'
                    onClick={() => {
                        setShowCategoryList(!showCategoryList);
                    }}
                    width={`${settings.notesReversed && "100%"}`}
                >
                    <FaListUl />
                    {settings.noteCategory}
                </Button>
            </div>

            {/* Category List */}
            {showCategoryList && (
                <div className='flex justify-center gap-6 animate-growY'>
                    <NotesDropdown
                        db={db}
                        setShowCategoryList={setShowCategoryList}
                    />
                </div>
            )}

            {/* Note List */}
            <div
                className={`flex flex-wrap flex-col ${
                    !settings.notesReversed && "flex-col-reverse"
                } gap-6`}
            >
                {notes &&
                    notes[settings.noteCategory] &&
                    Object.entries(notes[settings.noteCategory]).map(
                        ([key]) => {
                            return (
                                <Note
                                    key={key}
                                    noteId={key}
                                    db={db}
                                    latestNote={latestNote}
                                />
                            );
                        }
                    )}
            </div>
            <div className='flex justify-center gap-6'>
                {settings.notesReversed && (
                    <Button onClick={createNewNote} width='100%' height='50px'>
                        <FaPlus />
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Notes;
