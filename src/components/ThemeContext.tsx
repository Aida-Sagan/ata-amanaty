"use client";

import { createContext, useContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
    return useContext(ColorModeContext);
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<"light" | "dark">("dark");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prev) => (prev === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: { main: "#0A2640" },
                    secondary: { main: "#69E6A6" },
                    background: {
                        default: mode === "light" ? "#F4F6F8" : "#0A2640",
                        paper: mode === "light" ? "#FFFFFF" : "#1C3D5B",
                    },
                    text: {
                        primary: mode === "light" ? "#0A2640" : "#FFFFFF",
                        secondary: "#000000",
                    },
                },
                typography: {
                    h4: {
                        fontFamily: "Merriweather, serif",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        color: mode === "light" ? "#2c3e50" : "#FFFFFF",
                    },
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ColorModeContext.Provider>
    );
}
