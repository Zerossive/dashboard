import { useGlobalContext } from "../context";
import { getDatabase } from "firebase/database";
import Calendar from "../components/Calendar";
import Notes from "../components/Notes";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSwipeable } from "react-swipeable";
import { useEffect, useRef } from "react";
import Weather from "../components/Weather";

export default function Home() {
    const { settings, user } = useGlobalContext();

    const db = getDatabase();

    const container = useRef();
    const refPassthrough = (el) => {
        handlers.ref(el);
        container.current = el;
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // Swipe Navigation
    let navigate = useNavigate();
    const handlers = useSwipeable({
        onSwipedLeft: (eventData) => {
            if (
                document.activeElement === document.body &&
                Math.abs(eventData.deltaX) > 50
            ) {
                navigate("/settings");
            }
        },
        onSwiping: (eventData) => {
            if (
                document.activeElement === document.body &&
                eventData.dir === "Left"
            ) {
                container.current.style.transform = `translateX(${eventData.deltaX}px)`;
            }
        },
        onSwiped: () => {
            if (document.activeElement === document.body) {
                container.current.style.transform = `translateX(0px)`;
            }
        },
    });

    return (
        // Container
        <div
            className='flex flex-wrap overflow-hidden animate-fadein'
            {...handlers}
            ref={refPassthrough}
        >
            {/* Weather */}
            {settings.showWeather && user && (
                <div className='w-full lg:flex-1 order-2 lg:order-1 p-6'>
                    <Weather />
                </div>
            )}
            {/* Calendar */}
            {settings.showCalendar && user && (
                <div className='w-full lg:flex-1 order-1 lg:order-2 p-6'>
                    <Calendar />
                </div>
            )}
            {/* Notes */}
            {settings.showNotes && user && (
                <div className='w-full lg:flex-1 order-3 p-6'>
                    <Notes db={db} />
                </div>
            )}
            {/* Link to settings/signup page */}
            {!user && (
                <div className='w-full p-6 flex flex-wrap flex-col items-center'>
                    <p className='p-6'>
                        You muse have an account to use this website.
                    </p>
                    <Link to='/settings'>
                        <Button>Login or Sign Up</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
