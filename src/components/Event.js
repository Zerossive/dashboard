import React from "react";
import {
    FaBirthdayCake,
    FaCalendarDay,
    FaExclamation,
    FaQuestion,
    FaTasks,
    FaTrash,
} from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import { useGlobalContext } from "../context";
import ButtonInline from "./ButtonInline";
import { ref, update } from "firebase/database";

function Event({ eventId, db, icon, date, name, repeat }) {
    const { user, events, setEvents } = useGlobalContext();

    let shortDate = date.slice(5);
    if (shortDate[3] === "0") {
        shortDate = shortDate.slice(0, 3) + shortDate.slice(4);
    }
    if (shortDate[0] === "0") {
        shortDate = shortDate.slice(1);
    }
    shortDate = shortDate.replace("-", " / ");

    const handleDeleteEvent = () => {
        const updates = {};
        updates["/users/" + user.uid + "/events/" + eventId] = null;
        update(ref(db), updates);
        let tempEvents = { ...events };
        delete tempEvents[eventId];
        setEvents(tempEvents);
    };

    return (
        <div className='bg-midground rounded-md flex items-stretch group overflow-hidden'>
            {icon && (
                <div className='p-6 m-auto'>
                    {icon === "birthday" && <FaBirthdayCake size={32} />}
                    {icon === "exclamation" && <FaExclamation size={32} />}
                    {icon === "question" && <FaQuestion size={32} />}
                    {icon === "tasks" && <FaTasks size={32} />}
                    {icon === "calendar" && <FaCalendarDay size={32} />}
                </div>
            )}
            <div className=' flex w-full items-center gap-6 px-3'>
                <p className='w-1/4 text-right md:text-right whitespace-nowrap'>
                    {shortDate}
                </p>
                <p className='w-3/4 py-3'>{name}</p>
            </div>
            <div className='flex-grow'></div>
            <div className='p-3 opacity-50 flex items-center'>
                {repeat && <FiRepeat />}
            </div>
            <div className='h-auto lg:opacity-50 lg:group-hover:opacity-100 duration-150'>
                <ButtonInline onClick={handleDeleteEvent} height='100%'>
                    <FaTrash />
                </ButtonInline>
            </div>
        </div>
    );
}

export default Event;
