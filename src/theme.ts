import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light", // Можно поменять на "dark"
        primary: {
            main: "#0A2640", // Основной цвет
        },
        secondary: {
            main: "#69E6A6", // Дополнительный цвет
        },
        background: {
            default: "#F4F6F8", // Цвет фона
            paper: "#FFFFFF", // Цвет карточек
        },
        text: {
            primary: "#0A2640", // Основной цвет текста
            secondary: "#000000", // Вторичный цвет текста
        },
    },
    typography: {
        h4: {
            fontFamily: 'Merriweather, serif',
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: '#2c3e50',
        },
    },
});

export default theme;
