"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Button, Box } from "@mui/material";
import { useLanguage } from "@/lib/LanguageContext";
import {IconBrandTelegram, IconClipboardData} from "@tabler/icons-react";

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
                    <IconClipboardData stroke={2} />  {t("successTitle")}
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                    {requestId || t("loading")}
                </Typography>

                <Box sx={{ mt: 3, border: "1px solid #ddd", borderRadius: 2, padding: 2 }}>
                    <Typography sx={{fontWeight: 700}}>{t("successMessage")}</Typography>
                </Box>

                <Button
                    variant="contained"
                    sx={{ mt: 3 }}
                    onClick={() => router.push("/")}
                >
                    {t("backToHome")}
                </Button>
            </Box>
            <Box
                sx={{
                    p: 2,
                    mt: 4,
                    border: "1px solid #0f172a",
                    borderRadius: 2,
                    backgroundColor: "#f4f4f4",
                    textAlign: "center",
                    boxShadow: 2,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#004991", mb: 1 }}>
                    {t("telegramHelp")}
                </Typography>
                <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: t("telegramInfo") }}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="outlined"
                    color="primary"
                    href="https://t.me/atamanaty"
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<IconBrandTelegram />}
                >
                    {t("telegramGo")}
                </Button>
            </Box>

            <Box
                sx={{
                    p: 2,
                    mt: 4,
                    border: "1px solid #d32f2f",
                    borderRadius: 2,
                    backgroundColor: "#fff3f3",
                    textAlign: "center",
                    boxShadow: 2,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#b71c1c", mb: 1 }}>
                    {t("techProblemsTitle")}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    {t("techProblemsText")}
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ fontWeight: "bold", color: "#5e1414" }}
                    href="https://t.me/aida_sgndkva"
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<IconBrandTelegram />}
                >
                    @aida_sgndkva
                </Button>
                <p>
                    aidasagan369@gmail.com
                </p>

            </Box>
        </Container>
    );
}
