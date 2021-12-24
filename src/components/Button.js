import React from "react";

export default function Button(props) {
    const {
        background,
        color,
        height,
        width,
        onClick,
        hoverBackground,
        hoverColor,
        classes,
    } = props;

    return (
        <button
            className={`select-none rounded-md px-4 py-2 flex justify-center gap-6 items-center transition-all duration-75 transform hover:scale-105 dark:bg-foreground dark:hover:bg-accent hover:shadow-md tracking-widest active:scale-100 ${classes}`}
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
            {props.children}
        </button>
    );
}
