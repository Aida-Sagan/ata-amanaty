"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Добавил useRouter для навигации
import { Typography, Box, Button, TextField, Card, CardContent, Select, MenuItem, Modal } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Image from "next/image";

import { useTheme } from "@mui/material/styles";
import axios from "axios";

export default function HomePage() {
    const router = useRouter(); // Хук для перехода между страницами
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [statistics, setStatistics] = useState({
        submittedToday: 0,
        foundToday: 0,
    });
    const [darkMode, setDarkMode] = useState(theme.palette.mode === "dark");
    const [statusInput, setStatusInput] = useState("");

    useEffect(() => {
        axios.get("/api/statistics").then((response) => {
            setStatistics(response.data);
            setLoading(false);
        }).catch((error) => {
            console.error("Ошибка загрузки статистики:", error);
            setLoading(false);
        });
    }, []);


    const handleCheckStatus = async () => {
        if (!statusInput.trim()) {
            setModalMessage("Пожалуйста, введите номер заявки.");
            setOpenModal(true);
            return;
        }

        try {
            const response = await axios.post("/api/check-status", { requestNumber: statusInput });

            if (response.data.success) {
                router.push(`/status/${statusInput}`); // Перенаправляем на страницу статуса
            } else {
                setModalMessage("Такого номера заявки не существует.");
                setOpenModal(true);
            }
        } catch (error) {
            console.error("Ошибка при проверке статуса:", error);
            setModalMessage("Такого номера заявки не существует.");
            setOpenModal(true);
        }
    };


    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: darkMode ? "#0A2640" : "#FFFFFF",
                color: darkMode ? "#FFFFFF" : "#0A2640",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Верхний блок */}
            <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 50px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Image src="/logo.png" alt="Logo" width={200} height={110} />
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <Button onClick={() => setDarkMode(!darkMode)}>
                        <Brightness4Icon sx={{ color: darkMode ? "#fff" : "#000" }} />
                    </Button>

                    <Select defaultValue="Русский" variant="outlined" sx={{ backgroundColor: darkMode ? "#1C3D5B" : "#FFFFFF", color: darkMode ? "#FFF" : "#000" }}>
                        <MenuItem value="Русский">Русский</MenuItem>
                        <MenuItem value="Қазақша">Қазақша</MenuItem>
                    </Select>

                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 3 }}
                        onClick={() => router.push("/admin/login")}
                    >
                        Войти как админ
                    </Button>
                </Box>
            </Box>

            {/* Основной контент + карточки */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={5} mt={5}
                sx={{ flexWrap: "wrap", marginTop: "10%" }}
            >
                {/* Левый блок с текстом и кнопкой */}
                <Box sx={{ textAlign: "center", maxWidth: "600px" }}>
                    <Typography sx={{ fontSize: "18px" }}>
                        ОО «Atamyn Amanaty» принимает заявки на поиск пропавших без вести в годы Второй мировой войны, а также на поиск мест захоронений, уточнение мест захоронений, уточнение боевого пути.
                    </Typography>

                    {/* Кнопка с переходом на страницу /form */}
                    <Button
                        variant="contained"
                        onClick={() => router.push("/form")} // Добавлен переход
                        sx={{
                            backgroundColor: "#69E6A6",
                            color: "#0A2640",
                            padding: "12px 32px",
                            borderRadius: "25px",
                            fontWeight: "bold",
                            mt: 3,
                            "&:hover": { backgroundColor: "#2d9d63" },
                        }}
                    >
                        ПОДАТЬ ЗАЯВКУ
                    </Button>
                </Box>

                {/* Блок с карточками */}
                <Box display="flex" gap={3}>
                    <Card sx={{ backgroundColor: darkMode ? "#1C3D5B" : "#F1F1F1", padding: 2, width: "300px", borderRadius: "15px" }}>
                        <CardContent>
                            <svg width="49" height="10" viewBox="0 0 49 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="4.94209" cy="5" rx="4.8" ry="5" fill="#FC5B00" />
                                <ellipse cx="24.1422" cy="5" rx="4.8" ry="5" fill="#ECAA00" />
                                <ellipse cx="43.342" cy="5" rx="4.8" ry="5" fill="#009D10" />
                            </svg>
                            <Typography variant="h6"
                                        sx={{ color: darkMode ? "#F1F1F1" : "#1C3D5B"}}
                            >Количество поданных заявок:</Typography>
                            <Typography variant="h4" color="primary" sx={{ mt: 1, textAlign: "center", color: darkMode ? "#e4b449" : "#1C3D5B" }}>
                                {loading ? "..." : statistics.submittedToday}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ backgroundColor: darkMode ? "#1C3D5B" : "#F1F1F1", padding: 2, width: "300px", borderRadius: "15px" }}>
                        <CardContent>
                            <svg width="49" height="10" viewBox="0 0 49 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="4.94209" cy="5" rx="4.8" ry="5" fill="#FC5B00" />
                                <ellipse cx="24.1422" cy="5" rx="4.8" ry="5" fill="#ECAA00" />
                                <ellipse cx="43.342" cy="5" rx="4.8" ry="5" fill="#009D10" />
                            </svg>
                            <Typography variant="h6" sx={{ color: darkMode ? "#F1F1F1" : "#1C3D5B"}}>
                                Количество найденных заявок:
                            </Typography>
                            <Typography variant="h4" color="success.main" sx={{ mt: 1, textAlign: "center", color: darkMode ? "#25d366" : "#00b13f"  }}>
                                {loading ? "..." : statistics.foundToday}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Поле для проверки статуса заявки */}
            <Box sx={{ display: "flex", alignItems: "center", mt: 5 }}>
                <TextField
                    placeholder="Введите номер заявки"
                    variant="outlined"
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    sx={{
                        backgroundColor: darkMode ? "#0A2640" : "#FFFFFF",
                        border: `2px solid ${darkMode ? "#FFFFFF" : "#000"}`,
                        color: darkMode ? "#FFFFFF" : "#FFFFFF",
                        borderRadius: "25px",
                        "& .MuiOutlinedInput-root": { borderRadius: "25px" },
                        marginRight: "10px",
                    }}
                />
                <Button
                    variant="outlined"
                    onClick={handleCheckStatus} // Добавляем обработчик
                    sx={{
                        borderRadius: "25px",
                        padding: "12px 32px",
                        border: `2px solid ${darkMode ? "#FFFFFF" : "#000"}`,
                        color: darkMode ? "#FFFFFF" : "#000",
                        fontWeight: "bold",
                        "&:hover": { borderColor: "#69E6A6", color: "#69E6A6" },
                    }}
                >
                    ПРОВЕРИТЬ СТАТУС ЗАЯВКИ
                </Button>

            </Box>

            {/* Модальное окно */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 500,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 3,
                        borderRadius: "10px",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2, color: '#c13b3b', fontWeight: "bold" }}>
                        Ошибка
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {modalMessage}
                    </Typography>
                    <Button variant="contained" onClick={() => setOpenModal(false)}>
                        Закрыть
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
