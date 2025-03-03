"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Button, Box } from "@mui/material";

export default function SuccessPage() {
    const router = useRouter();
    const [requestId, setRequestId] = useState<string | null>(null);

    useEffect(() => {
        const storedRequestId = localStorage.getItem("requestId");
        if (!storedRequestId) {
            router.push("/form"); // Если нет номера заявки, отправляем обратно на форму
            return;
        }
        setRequestId(storedRequestId);
    }, [router]);

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
            <Box sx={{ border: "2px solid #ccc", borderRadius: 3, padding: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Ваш номер заявки:
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    #{requestId || "Загрузка..."}
                </Typography>

                <Box sx={{ mt: 3, border: "1px solid #ddd", borderRadius: 2, padding: 2 }}>
                    <Typography>
                        Проверять свой статус заявки можно на главной странице.
                        <br />
                        <strong>Пожалуйста, сохраните свой номер заявки!</strong>
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 3 }}
                    onClick={() => router.push("/")}
                >
                    Вернуться на главную
                </Button>
            </Box>
        </Container>
    );
}
