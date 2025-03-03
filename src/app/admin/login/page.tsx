"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import Image from "next/image";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        try {
            const response = await axios.post("/api/auth/", { username, password }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("Ответ от сервера:", response.data);

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                console.log("✅ Токен сохранён:", response.data.token);
                router.push("/admin");
            } else {
                setError("❌ Неверные учетные данные");
            }
        } catch (err) {
            console.error("Ошибка при входе:", err);
            setError("⚠️ Ошибка при входе. Попробуйте снова.");
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Card sx={{ padding: "20px", maxWidth: "400px", width: "100%" }}>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Image src="/logo.png" alt="Logo" width={180} height={100} />
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
                        Вход для администраторов
                    </Typography>
                    <TextField label="Логин" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} sx={{ mb: 2 }} />
                    <TextField label="Пароль" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                    <Button variant="contained" fullWidth onClick={handleLogin}>
                        Войти
                    </Button>
                    <Button variant="outlined" onClick={() => router.push("/")}  sx={{mt: '1rem'}} fullWidth>
                        вернуться на главную
                    </Button>
                </CardContent>

            </Card>
        </Box>
    );
}
