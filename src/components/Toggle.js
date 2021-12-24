import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

function Toggle(data) {
    const {
        text,
        checked,
        background,
        color,
        height,
        width,
        onClick,
        hoverBackground,
        hoverColor,
        classes,
    } = data;

    return (
        <button
            className={`select-none rounded-md px-4 py-2 flex justify-center gap-6 items-center transition-all duration-75 hover:shadow-md tracking-widest active:scale-95 ${
                checked ? "dark:bg-accent" : "dark:bg-midground"
            } ${classes}`}
            aria-label={`${background} button`}
            style={{
                background: `${background}`,
                color: `${color}`,
                height: `${height ? height : "auto"}`,
                width: `${width ? width : "auto"}`,
            }}
            onMouseEnter={(ele) => {
                ele.target.style.background = `${hoverBackground}`;
                ele.target.style.color = `${hoverColor}`;
            }}
            onMouseLeave={(ele) => {
                ele.target.style.background = `${background || ""}`;
                ele.target.style.color = `${color || ""}`;
            }}
            onClick={onClick}
        >
            {checked && <FaCheck />}
            {!checked && <FaTimes />}
            {text}
        </button>
    );
}

export default Toggle;
