import React from "react";
import ReactWeather, { useOpenWeather } from "react-open-weather";

function WeatherWidget({
    location,
    lat,
    lon,
    numberSystem,
    degreesUnit,
    speedUnit,
}) {
    const { data, isLoading, errorMessage } = useOpenWeather({
        key: process.env.REACT_APP_OPENWEATHER_APIKEY,
        lat: lat,
        lon: lon,
        // lat: "32.742624526711346",
        // lon: "-96.57914697085766",
        lang: "en",
        unit: numberSystem, // values are (metric, standard, imperial)
    });

    const customStyles = {
        // fontFamily: "Helvetica, sans-serif",
        gradientStart: "hsl(210,30%,17%)",
        gradientMid: "hsl(210,30%,17%)",
        gradientEnd: "hsl(210,30%,17%)",
        locationFontColor: "#FFF",
        todayTempFontColor: "#FFF",
        todayDateFontColor: "#B5DEF4",
        todayRangeFontColor: "#B5DEF4",
        todayDescFontColor: "#B5DEF4",
        todayInfoFontColor: "#B5DEF4",
        todayIconColor: "#FFF",
        forecastBackgroundColor: "hsl(210,30%,17%)",
        forecastSeparatorColor: "transparent",
        // forecastSeparatorColor: "hsl(210, 30%, 30%)",
        forecastDateColor: "#FFF",
        forecastDescColor: "#FFF",
        forecastRangeColor: "#FFF",
        forecastIconColor: "#4BC4F7",
    };
    return (
        <>
            {/* Placeholder */}
            {isLoading && (
                <div className='bg-midground rounded-md animate-pulse w-full h-96'></div>
            )}
            {/* Show weather on load */}
            {!isLoading && (
                <a
                    className='cursor-pointer'
                    href='https://openweathermap.org/'
                >
                    <ReactWeather
                        isLoading={isLoading}
                        errorMessage={errorMessage}
                        data={data}
                        lang='en'
                        locationLabel={location}
                        unitsLabels={{
                            temperature: degreesUnit,
                            windSpeed: speedUnit,
                        }}
                        showForecast={true}
                        theme={customStyles}
                    />
                </a>
            )}
        </>
    );
}

export default WeatherWidget;
