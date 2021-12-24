import { useGlobalContext } from "../context";
import { getDatabase } from "firebase/database";
import Calendar from "../components/Calendar";
import Notes from "../components/Notes";
import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function Home() {
    const { db } = getDatabase();

    const { settings, user } = useGlobalContext();

    return (
        // Container
        <div className='flex flex-wrap overflow-hidden animate-fadein'>
            {/* Weather */}
            {settings.showWeather && user && (
                <div className='w-full lg:flex-1 order-2 lg:order-1 p-6'>
                    {/* INSERT WEATHER HERE */}
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
                    {/* TESTING */}
                    <Notes data={{ db: db }} />
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
