import { useState, useEffect } from "react";
import { get, getDatabase, ref, child, update, set } from "firebase/database";
import React from "react";
import Note from "./Note";
import Button from "./Button";
import { useGlobalContext } from "../context";
import { FaListUl, FaPlus } from "react-icons/fa";
import NotesDropdown from "./NotesDropdown";

function Notes({ data }) {
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

    // TESTING
    useEffect(() => {
        // console.log(notes);
    }, [settings]);

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
                    <NotesDropdown data={{ db: db, setShowCategoryList }} />
                </div>
            )}

            {/* Note List */}
            <div
                className={`flex flex-wrap flex-col ${
                    !settings.notesReversed && "flex-col-reverse"
                } gap-6`}
            >
                {
                    notes &&
                        notes[settings.noteCategory] &&
                        Object.entries(notes[settings.noteCategory]).map(
                            ([key, value]) => {
                                return (
                                    <Note
                                        key={key}
                                        data={{
                                            noteId: key,
                                            db,
                                            latestNote,
                                        }}
                                    />
                                );
                            }
                        )

                    // TESTING 3
                    // Object.entries(notes).map((key, i) => {
                    //     if (key[0] === settings.noteCategory) {
                    //         // console.log(key[1]);
                    //         return Object.keys(key[1]).map((noteId, i) => {
                    //             // console.log(note);
                    //             return (
                    //                 <Note
                    //                     key={i}
                    //                     data={{
                    //                         noteId: noteId,
                    //                         noteValue:
                    //                             notes[
                    //                                 settings.noteCategory
                    //                             ][noteId],
                    //                         db,
                    //                         latestNote,
                    //                     }}
                    //                 />
                    //             );
                    //         });
                    //     }
                    // })

                    // TESTING 2
                    // Object.entries(notes[settings.noteCategory]).map(
                    //     (key, i) => {
                    //         console.log(key);
                    //         return (
                    //             <Note
                    //                 key={i}
                    //                 data={{
                    //                     noteId: key[0],
                    //                     db,
                    //                     latestNote,
                    //                 }}
                    //             />
                    //         );
                    //     }
                    // )

                    // TESTING 1
                    // Object.keys(notes[settings.noteCategory]).map((key, i) => {
                    //     // console.log(notes[settings.noteCategory][key]);
                    //     console.log(notes);
                    //     return (
                    //         <Note
                    //             key={i}
                    //             data={{
                    //                 noteId: key,
                    //                 noteValue:
                    //                     notes[settings.noteCategory][key],
                    //                 db,
                    //                 latestNote,
                    //             }}
                    //         />
                    //     );
                    // })
                }
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
