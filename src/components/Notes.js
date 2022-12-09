import React, { useEffect, useState } from "react";
import { ref, update } from "firebase/database";
import Note from "./Note";
import Button from "./Button";
import { useGlobalContext } from "../context";
import { FaListUl, FaPlus } from "react-icons/fa";
import NotesDropdown from "./NotesDropdown";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function Notes({ db }) {
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

	// Hotkeys
	const handleHotkey = (e) => {
		const key = e.key;
		if (document.activeElement === document.body) {
			switch (key) {
				case "n":
					createNewNote();
					break;
				case "c":
					setShowCategoryList(!showCategoryList);
					break;

				default:
					break;
			}
		}
	};
	useEffect(() => {
		document.addEventListener("keypress", handleHotkey, true);
		return () => {
			document.removeEventListener("keypress", handleHotkey, true);
		};
	});

	// auto-animation hook
	const [notesAnimationParent] = useAutoAnimate();
	const [noteListAnimationParent] = useAutoAnimate({ duration: 150 });

	return (
		<div
			className={`flex flex-col w-full gap-6 lg:h-[calc(100vh-7rem)] lg:overflow-auto`}
			ref={notesAnimationParent}
		>
			{/* Add new note button */}
			<div className='flex justify-center gap-6 w-full'>
				{!settings.notesReversed && (
					<Button
						onClick={createNewNote}
						width={`${settings.notesReversed ? "100%" : "50%"}`}
						height='50px'
					>
						<FaPlus />
						New Note
					</Button>
				)}
				<Button
					height='50px'
					onClick={() => {
						setShowCategoryList(!showCategoryList);
					}}
					width={`${settings.notesReversed ? "100%" : "50%"}`}
				>
					<FaListUl />
					{settings.noteCategory}
				</Button>
			</div>

			{/* Category List */}
			{showCategoryList && (
				<div className='flex justify-center gap-6 w-full'>
					<NotesDropdown
						db={db}
						setShowCategoryList={setShowCategoryList}
					/>
				</div>
			)}

			{/* Note List */}
			<ol
				className={`flex flex-col basis-full gap-6 justify-start ${
					!settings.notesReversed && "flex-col-reverse justify-end"
				}`}
				ref={noteListAnimationParent}
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
			</ol>

			{/* Add new note button when notes are reversed */}
			<div className='flex justify-center w-full gap-6'>
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
