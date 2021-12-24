import { useGlobalContext } from "../context";
import { getDatabase } from "firebase/database";
import Calendar from "../components/Calendar";
import Notes from "../components/Notes";

export default function Home() {
    const db = getDatabase();

    const { settings } = useGlobalContext();

    return (
        // Container
        <div className='flex flex-wrap overflow-hidden animate-fadein'>
            {/* Weather */}
            {settings.showWeather && (
                <div className='w-full lg:flex-1 order-2 lg:order-1 p-6'>
                    {/* INSERT WEATHER HERE */}
                </div>
            )}
            {/* Calendar */}
            {settings.showCalendar && (
                <div className='w-full lg:flex-1 order-1 lg:order-2 p-6'>
                    <Calendar />
                </div>
            )}
            {/* Notes */}
            {settings.showNotes && (
                <div className='w-full lg:flex-1 order-3 p-6'>
                    {/* TESTING */}
                    <Notes data={{ db: db }} />
                </div>
            )}
        </div>
    );
}
