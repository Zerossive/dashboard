module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                background: "hsl(210, 30%, 13%)",
                midground: "hsl(210,30%,17%)",
                foreground: "hsl(210,30%,22%)",
                border: "hsl(210,30%,26%)",
                accent: "hsl(210,30%,30%)",
                error: "hsl(0,50%,50%)",
            },
            keyframes: {
                fadein: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                grow: {
                    "0%": { transform: "scale(0.9)" },
                    "100%": { transform: "scale(1)" },
                },
                growfadein: {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                growY: {
                    "0%": {
                        opacity: "0",
                        transform: "scaleY(0)",
                        transformOrigin: "top",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "scaleY(1)",
                        transformOrigin: "top",
                    },
                },
            },
            animation: {
                fadein: "fadein 0.5s ease-in-out",
                grow: "grow 0.5s ease-in-out",
                growfadein: "growfadein 0.5s ease-in-out",
                growY: "growY 0.1s linear",
            },
        },
    },
    plugins: [],
};
