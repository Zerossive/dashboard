import React from "react";

export default function TextInput(data) {
    const {
        value,
        placeholder,
        onChange,
        background,
        color,
        height,
        width,
        underline,
        autofocus,
    } = data;
    return (
        <input
            type='text'
            className={`p-3 bg-transparent outline-none ${
                underline && "border-b-2 border-border focus:border-accent"
            }`}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
                onChange && onChange(e);
            }}
            style={{
                background: `${background}`,
                color: `${color}`,
                height: `${height ? height : "auto"}`,
                width: `${width ? width : "auto"}`,
            }}
            autoFocus={autofocus}
        />
    );
}
