import React from "react";

export default function ButtonInline(props) {
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
            className={`select-none px-4 py-2 flex justify-center gap-6 items-center transition-all duration-75 bg-midground tracking-widest active:bg-accent ${classes}`}
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
            onClick={(e) => {
                onClick && onClick();
                setTimeout(() => {
                    e.target.blur();
                }, 200);
            }}
        >
            {props.children}
        </button>
    );
}
