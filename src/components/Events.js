import React, { useEffect, useState } from "react";
import {
	FaBirthdayCake,
	FaCalendarDay,
	FaChevronDown,
	FaChevronUp,
	FaExclamation,
	FaPlus,
	FaQuestion,
	FaTasks,
	FaTimes,
} from "react-icons/fa";
import Button from "./Button";
import Event from "./Event";
import TextInput from "./TextInput";
import Toggle from "./Toggle";
import { ref, update } from "firebase/database";
import { useGlobalContext } from "../context";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function Events({ db }) {
	const { user, events, setEvents } = useGlobalContext();

	const date = new Date();
	date.setHours(0, 0, 0, 0);
	const currentDate = date.toISOString().slice(0, 10);
	const [selectedDate, setSelectedDate] = useState(currentDate);

	const [showEventInput, setShowEventInput] = useState(false);
	const [eventName, setEventName] = useState("");
	const [eventRepeat, setEventRepeat] = useState(false);
	const [selectedIcon, setSelectedIcon] = useState("");

	const [showMore, setShowMore] = useState(false);
	let showCount = 0;

	// Create a new event
	const handleCreateEvent = () => {
		let newDate = selectedDate;
		const today = new Date();

		// if input year has passed, update it before creation
		const currentYear = today.getFullYear();
		if (currentYear > newDate.slice(0, 4)) {
			newDate = currentYear + newDate.slice(4);
		}

		const newId =
			"event_" + newDate.replaceAll("-", "_") + "_" + today.getTime();
		const newEvent = {
			name: eventName,
			icon: selectedIcon,
			date: newDate,
			repeat: eventRepeat,
		};
		const updates = {};
		updates["/users/" + user.uid + "/events/" + newId] = newEvent;
		update(ref(db), updates);
		setEvents((prevState) => ({
			...prevState,
			[newId]: newEvent,
		}));

		setShowEventInput(false);
	};

	// Delete event
	const deleteEvent = (eventId) => {
		const updates = {};
		updates["/users/" + user.uid + "/events/" + eventId] = null;
		update(ref(db), updates);
		let tempEvents = { ...events };
		delete tempEvents[eventId];
		setEvents(tempEvents);

		console.log("Deleted event:", eventId);
	};

	// Update year of repeating event
	const updateYear = (eventId, newDate) => {
		const oldEvent = events[eventId];
		deleteEvent(eventId);

		const newId =
			"event_" +
			newDate.replaceAll("-", "_") +
			"_" +
			new Date().getTime();
		const newEvent = {
			...oldEvent,
			date: newDate,
		};
		const updates = {};
		updates["/users/" + user.uid + "/events/" + newId] = newEvent;
		update(ref(db), updates);
		setEvents((prevState) => ({
			...prevState,
			[newId]: newEvent,
		}));
	};

	// Reset event input values
	useEffect(() => {
		if (showEventInput) {
			setEventName("");
			setEventRepeat(false);
			setSelectedIcon("");
			const date = new Date();
			const today =
				date.getFullYear().toString() +
				"-" +
				(date.getMonth() + 1).toString().padStart(2, 0) +
				"-" +
				date.getDate().toString().padStart(2, 0);
			setSelectedDate(today);
		}
	}, [showEventInput]);

	useEffect(() => {
		Object.entries(events).map(([key]) => {
			const event = events[key];

			// if past date and not repeating, delete event
			let today = new Date();
			today.setHours(0, 0, 0, 0);

			const eventDate = new Date(
				Date.parse(event.date.replaceAll("-", ","))
			);
			if (eventDate < today && !event.repeat) {
				deleteEvent(key);
				return null;
			}

			// update year if event repeats to keep it at the top of the list
			if (eventDate < today && event.repeat) {
				const currentYear = new Date().getFullYear();
				if (currentYear >= event.date.slice(0, 4)) {
					updateYear(key, currentYear + 1 + event.date.slice(4));
				}
			}

			return null;
		});
	});

	// auto-animation hook
	const [eventsAnimationParent] = useAutoAnimate();
	const [eventListAnimationParent] = useAutoAnimate({ duration: 150 });

	return (
		<div className='flex flex-col gap-6 w-full' ref={eventsAnimationParent}>
			{/* Add new event button */}
			{!showEventInput && (
				<Button
					width='100%'
					height='50px'
					onClick={() => setShowEventInput(true)}
				>
					<FaPlus />
					New Event
				</Button>
			)}

			{/* New event creation inputs */}
			{showEventInput && (
				<div className='bg-midground rounded-md overflow-hidden flex flex-wrap justify-center p-3'>
					<TextInput
						placeholder='Event Name'
						width='100%'
						underline
						value={eventName}
						onChange={(e) => {
							setEventName(e.target.value);
						}}
						autofocus
					/>
					<input
						type='date'
						className='p-3 bg-transparent border-b-2 border-border focus:border-accent outline-none w-1/2'
						value={selectedDate}
						onChange={(e) => {
							setSelectedDate(e.target.value);
						}}
						style={{ colorScheme: "dark" }}
					/>
					<div className='w-1/2 p-3'>
						<Toggle
							text='Repeat'
							checked={eventRepeat}
							width='100%'
							height='50px'
							classes='dark:bg-foreground'
							className='border-red-300 border-3'
							onClick={() => setEventRepeat(!eventRepeat)}
						/>
					</div>
					{/* Icon Selector */}
					<div className='w-full p-3 pt-6 flex gap-3 flex-wrap'>
						<Button
							classes={`py-3 px-3 ${
								!selectedIcon && "scale-105 bg-accent"
							}`}
							onClick={() => setSelectedIcon("")}
						>
							<span>No Icon</span>
						</Button>
						<Button
							classes={`py-3 px-3 ${
								selectedIcon === "birthday" &&
								"scale-105 bg-accent"
							}`}
							onClick={() => setSelectedIcon("birthday")}
						>
							<FaBirthdayCake size={32} />
						</Button>
						<Button
							classes={`py-3 px-3 ${
								selectedIcon === "exclamation" &&
								"scale-105 bg-accent"
							}`}
							onClick={() => setSelectedIcon("exclamation")}
						>
							<FaExclamation size={32} />
						</Button>
						<Button
							classes={`py-3 px-3 ${
								selectedIcon === "question" &&
								"scale-105 bg-accent"
							}`}
							onClick={() => setSelectedIcon("question")}
						>
							<FaQuestion size={32} />
						</Button>
						<Button
							classes={`py-3 px-3 ${
								selectedIcon === "tasks" &&
								"scale-105 bg-accent"
							}`}
							onClick={() => setSelectedIcon("tasks")}
						>
							<FaTasks size={32} />
						</Button>
						<Button
							classes={`py-3 px-3 ${
								selectedIcon === "calendar" &&
								"scale-105 bg-accent"
							}`}
							onClick={() => setSelectedIcon("calendar")}
						>
							<FaCalendarDay size={32} />
						</Button>
					</div>
					{/* Submit/cancel */}
					<div className='p-3 flex-grow'>
						<Button
							width='100%'
							height='50px'
							onClick={() => setShowEventInput(false)}
						>
							<FaTimes />
							Cancel
						</Button>
					</div>
					<div className='p-3 flex-grow'>
						<Button
							width='100%'
							height='50px'
							onClick={handleCreateEvent}
						>
							<FaPlus />
							New Event
						</Button>
					</div>
					{/* <Button
						classes='flex-grow'
						height='50px'
						onClick={() => setShowEventInput(false)}
					>
						<FaTimes />
						Cancel
					</Button>
					<Button
						classes='flex-grow'
						height='50px'
						onClick={handleCreateEvent}
					>
						<FaPlus />
						New Event
					</Button> */}
				</div>
			)}

			{/* Events */}
			{events && (
				<ol
					className={`flex flex-col gap-6 order-2 justify-start`}
					ref={eventListAnimationParent}
				>
					{Object.entries(events)
						.sort()
						.map(([key, event]) => {
							// Handle show more state
							showCount++;
							if (!showMore && showCount > 5) {
								return null;
							}

							// Set active if date matches today
							let active = false;
							if (currentDate === event.date) {
								active = true;
							}

							return (
								<Event
									eventId={key}
									icon={event.icon}
									date={event.date}
									name={event.name}
									repeat={event.repeat}
									active={active}
									key={key}
									db={db}
								/>
							);
						})}
				</ol>
			)}

			{/* Show less button */}
			{Object.keys(events).length > 0 && showCount > 5 && showMore && (
				<button
					className='flex w-full justify-center items-center gap-3 hover:text-primary duration-75 p-3 active:scale-90 order-1'
					onClick={() => setShowMore(false)}
				>
					Show Less
					<FaChevronUp />
				</button>
			)}

			{/* Show more/less button */}
			{Object.keys(events).length > 0 && showCount > 5 && (
				<button
					className='flex w-full justify-center items-center gap-3 hover:text-primary duration-75 p-3 active:scale-90 order-3'
					onClick={() => setShowMore(!showMore)}
				>
					{showMore ? "Show Less" : "Show More"}
					{showMore ? <FaChevronUp /> : <FaChevronDown />}
				</button>
			)}
		</div>
	);
}

export default Events;
