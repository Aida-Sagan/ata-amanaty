"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Button, Box } from "@mui/material";
import { useLanguage } from "@/lib/LanguageContext";

export default function SuccessPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [requestId, setRequestId] = useState<string | null>(null);

    useEffect(() => {
        const storedRequestId = localStorage.getItem("requestId");
        if (!storedRequestId) {
            router.push("/form");
            return;
        }
        setRequestId(storedRequestId);
    }, [router]);

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
            <Box sx={{ border: "2px solid #ccc", borderRadius: 3, padding: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {t("successTitle")}
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                    {requestId || t("loading")}
                </Typography>

                <Box sx={{ mt: 3, border: "1px solid #ddd", borderRadius: 2, padding: 2 }}>
                    <Typography sx={{fontWeight: 700}}>{t("successMessage")}</Typography>
                </Box>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 3 }}
                    onClick={() => router.push("/")}
                >
                    {t("backToHome")}
                </Button>
            </Box>
        </Container>
    );
}
