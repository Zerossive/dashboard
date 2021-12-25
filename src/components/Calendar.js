import React from "react";
import Clock from "react-live-clock";
import { useGlobalContext } from "../context";

function Calendar() {
    const { settings } = useGlobalContext();
    return (
        <div className='w-full flex flex-col items-center'>
            {/* Time & Date */}
            <div className='w-full flex flex-col items-center gap-6'>
                <h1 className='text-6xl flex items-center gap-3'>
                    <Clock
                        format={`${settings.formatAMPM ? "h" : "H"}:mm`}
                        ticking={true}
                    />
                    {settings.formatAMPM && (
                        <Clock
                            format={"a"}
                            ticking={true}
                            className='text-accent uppercase text-4xl'
                        />
                    )}
                </h1>
                <h2 className='text-3xl'>
                    <Clock format={"dddd, MMMM Do"} />
                </h2>
            </div>
            {/* INSERT EVENTS HERE */}
        </div>
    );
}

export default Calendar;
