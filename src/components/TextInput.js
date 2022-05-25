import React from "react";

export default function TextInput(data) {
	const {
		value,
		placeholder,
		onChange,
		onKeyDown,
		background,
		color,
		height,
		width,
		underline,
		autofocus,
		classes,
	} = data;
	return (
		<input
			type='text'
			className={`${classes} p-3 bg-transparent outline-none ${
				underline && "border-b-2 border-border focus:border-accent"
			} ${classes}`}
			value={value}
			placeholder={placeholder}
			onChange={(e) => {
				onChange && onChange(e);
			}}
			onKeyDown={(e) => {
				onKeyDown && onKeyDown(e);
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
