import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import WeatherWidget from "./WeatherWidget";

function Weather() {
    const { settings } = useGlobalContext();

    const [coords, setCoords] = useState();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setCoords({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            });
        });
    }, []);

    return (
        <div className='w-full'>
            {/* Placeholder */}
            {!coords && <div className='w-full h-96'></div>}
            {/* Show weather when coords are obtained */}
            {coords && (
                <WeatherWidget
                    location=''
                    lat={coords.lat}
                    lon={coords.lon}
                    numberSystem={`${
                        settings.weatherFormat ? "imperial" : "metric"
                    }`}
                    degreesUnit={`${settings.weatherFormat ? "F" : "C"}`}
                    speedUnit={`${settings.weatherFormat ? "mph" : "km/h"}`}
                />
            )}
        </div>
    );
}

export default Weather;
