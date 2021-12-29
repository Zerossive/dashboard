import { ref, update } from "firebase/database";
import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useGlobalContext } from "../context";
import Button from "./Button";

function NotesDropdown(data) {
    const { db, setShowCategoryList } = data;

    const { settings, setSettings, user, notes, setNotes } = useGlobalContext();

    const [newCategoryName, setNewCategoryName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChangeCategory = (category) => {
        const updates = {};
        updates["/users/" + user.uid + "/settings/noteCategory"] = category;
        update(ref(db), updates);
        setSettings({ ...settings, noteCategory: category });
        setShowCategoryList(false);
    };
    const handleNewCategory = () => {
        if (
            !settings.noteCategoryList.includes(newCategoryName) &&
            newCategoryName !== ""
        ) {
            const updates = {};
            updates["/users/" + user.uid + "/settings/noteCategoryList"] = [
                ...settings.noteCategoryList,
                newCategoryName,
            ];
            update(ref(db), updates);
            setSettings({
                ...settings,
                noteCategoryList: [
                    ...settings.noteCategoryList,
                    newCategoryName,
                ],
            });
        } else {
            setErrorMessage("No Duplicate or Empty Categories Allowed");
            console.log("No Duplicate or Empty Categories Allowed");
        }
        setNewCategoryName("");
    };
    const handleRemoveCategory = (category) => {
        if (settings.noteCategoryList.length <= 1) {
            setErrorMessage("Cannot Delete Last Category");
            console.log("Cannot Delete Last Category");
            return;
        }
        if (settings.noteCategory === category) {
            setErrorMessage("Cannot Delete Active Category");
            console.log("Cannot Delete Active Category");
            return;
        }

        let tempList = [...settings.noteCategoryList];
        tempList = tempList.filter((item) => item !== category);
        // Update list
        const updates = {};
        updates["/users/" + user.uid + "/settings/noteCategoryList"] = tempList;
        updates["/users/" + user.uid + "/notes/" + category] = null;
        update(ref(db), updates);
        setNotes({
            ...notes,
            [category]: null,
        });
        setSettings({
            ...settings,
            noteCategoryList: tempList,
        });
    };

    return (
        <div className='flex flex-wrap gap-6 justify-center w-full'>
            {errorMessage && (
                <button
                    className='bg-error w-full flex p-3 rounded-md justify-center animate-growfadein'
                    onClick={() => {
                        setErrorMessage("");
                    }}
                >
                    <p>{errorMessage} (tap to close)</p>
                </button>
            )}
            {settings.noteCategoryList.map((category, i) => {
                return (
                    <div className='flex w-full gap-6' key={i}>
                        <Button
                            width='100%'
                            height='50px'
                            onClick={() => {
                                handleChangeCategory(category);
                            }}
                        >
                            {category}
                        </Button>
                        <Button
                            height='50px'
                            onClick={() => {
                                handleRemoveCategory(category);
                            }}
                        >
                            <FaTrash />
                        </Button>
                    </div>
                );
            })}
            <input
                type='text'
                className='bg-foreground rounded-md p-3 flex-grow'
                placeholder='New Category Name'
                value={newCategoryName}
                onChange={(e) => {
                    setNewCategoryName(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleNewCategory();
                    }
                }}
            />
            <Button onClick={handleNewCategory}>
                <FaPlus />
            </Button>
        </div>
    );
}

export default NotesDropdown;
