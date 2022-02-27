import React, { useEffect, useState } from "react";
import {
    FaBirthdayCake,
    FaCalendarDay,
    FaChevronDown,
    FaExclamation,
    FaPlus,
    FaQuestion,
    FaTasks,
} from "react-icons/fa";
import Button from "./Button";
import Event from "./Event";
import TextInput from "./TextInput";
import Toggle from "./Toggle";
import { ref, update } from "firebase/database";
import { useGlobalContext } from "../context";

function Events({ db }) {
    const { user, events, setEvents } = useGlobalContext();

    const date = new Date();
    const currentDate = date.toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = useState(currentDate);

    const [showEventInput, setShowEventInput] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventRepeat, setEventRepeat] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState("");

    // Create a new event
    const handleCreateEvent = () => {
        let newDate = selectedDate;
        const newId =
            "event_" +
            newDate.replaceAll("-", "_") +
            "_" +
            new Date().getTime();
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

    const deleteEvent = (eventId) => {
        const updates = {};
        updates["/users/" + user.uid + "/events/" + eventId] = null;
        update(ref(db), updates);
        let tempEvents = { ...events };
        delete tempEvents[eventId];
        setEvents(tempEvents);

        console.log("Deleted event:", eventId);
    };
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
                if (currentYear > event.date.slice(0, 4)) {
                    updateYear(key, currentYear + event.date.slice(4));
                }
            }

            return null;
        });
    });

    return (
        <div className='flex flex-col gap-6 w-full'>
            {/* Add new event button */}
            {!showEventInput && (
                <div className='animate-fadein'>
                    <Button
                        width='100%'
                        height='50px'
                        onClick={() => setShowEventInput(true)}
                    >
                        <FaPlus />
                    </Button>
                </div>
            )}

            {/* New event creation inputs */}
            {showEventInput && (
                <div className='bg-midground rounded-md overflow-hidden flex flex-wrap justify-center p-3 animate-growfadein'>
                    <TextInput
                        placeholder='Event Name'
                        width='100%'
                        underline
                        value={eventName}
                        onChange={(e) => {
                            // console.log(e.target.value);
                            setEventName(e.target.value);
                        }}
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
                    <div className='p-3 w-1/2'>
                        <Button
                            width='100%'
                            onClick={() => setShowEventInput(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                    <div className='p-3 w-1/2'>
                        <Button width='100%' onClick={handleCreateEvent}>
                            Submit
                        </Button>
                    </div>
                </div>
            )}

            {/* Events */}
            {events && (
                <div className={`flex flex-col gap-6 animate-growfadein`}>
                    {Object.entries(events)
                        .sort()
                        .map(([key]) => {
                            const event = events[key];

                            return (
                                <Event
                                    eventId={key}
                                    icon={event.icon}
                                    date={event.date}
                                    name={event.name}
                                    repeat={event.repeat}
                                    key={key}
                                    db={db}
                                />
                            );
                        })}
                </div>
            )}
            {/* Show more button */}
            {/* {Object.keys(events).length > 0 && (
                <button className='flex w-full justify-center items-center gap-3 hover:text-primary duration-75 p-3 active:scale-90'>
                    Show More
                    <FaChevronDown />
                </button>
            )} */}
        </div>
    );
}

export default Events;
