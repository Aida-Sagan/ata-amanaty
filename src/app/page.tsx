"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Typography,
    Box,
    Button,
    TextField,
    Card,
    CardContent,
    Select,
    MenuItem,
    Modal,
    Link
} from "@mui/material";
import { IconBrandInstagram, IconBrandFacebook } from '@tabler/icons-react';
import { useLanguage } from "@/lib/LanguageContext";

import Image from "next/image";
import axios from "axios";

export default function HomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [statistics, setStatistics] = useState({
        totalApplications: 0,
        foundPeople: 0,
        regions: [],
        countries: [],
    });
    const [statusInput, setStatusInput] = useState("");
    const { language, changeLanguage, t } = useLanguage();

    useEffect(() => {
        axios.get("/api/statistics")
            .then((response) => {
                setStatistics(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка загрузки статистики:", error);
                setLoading(false);
            });
    }, []);

    const handleCheckStatus = async () => {
        if (!statusInput.trim()) {
            setModalMessage(t("empty"));
            setOpenModal(true);
            return;
        }

        try {
            const response = await axios.post("/api/check-status", { requestNumber: statusInput });

            if (response.data.success) {
                router.push(`/status/${statusInput}`);
            } else {
                setModalMessage(response.data.message || t("notFound"));
                setOpenModal(true);
            }
        } catch (error) {
            console.error("Ошибка при проверке статуса:", error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 500) {
                    setModalMessage(t("server"));
                } else {
                    setModalMessage(error.response?.data?.message || t("other"));
                }
            } else {
                setModalMessage(t("unknown"));
            }
            setOpenModal(true);
        }
    };

    return (
        <Box sx={{ minHeight: "50vh", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#f9fafb", overflowX: "hidden" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1 }}>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                    <Image src="/logo.png" alt="Logo" width={200} height={110} />
                    <Box display="flex" alignItems="center" gap={2}>
                        <Select
                            value={language === "ru" ? "Русский" : "Қазақша"}
                            onChange={(e) => changeLanguage(e.target.value === "Русский" ? "ru" : "kz")}
                        >
                            <MenuItem value="Русский">Русский</MenuItem>
                            <MenuItem value="Қазақша">Қазақша</MenuItem>
                        </Select>

                        <Button variant="outlined" onClick={() => router.push("/admin/login")}>
                            {t("adminLogin")}
                        </Button>
                    </Box>
                </Box>

                <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}>
                    {t("title")}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, maxWidth: 625, textAlign: "center", color: "#334155" }}>
                    {t("description")}
                </Typography>

                <Box sx={{ display: "flex", gap: 3, mt: 4, flexWrap: "wrap", justifyContent: "center" }}>
                    <Card sx={{ width: 260, p: 2, borderRadius: 3, boxShadow: 2 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Typography variant="h6">{t("submitted")}</Typography>
                            <Typography variant="h3" sx={{ mt: 1 }}>{loading ? "..." : statistics.totalApplications}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ width: 260, p: 2, borderRadius: 3, boxShadow: 2 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Typography variant="h6">{t("found")}</Typography>
                            <Typography variant="h3" sx={{ mt: 1 }}>{loading ? "..." : statistics.foundPeople}</Typography>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#1976d2", color: "#ffffff", fontWeight: "bold", borderRadius: 3 }}
                        onClick={() => router.push("/form")}
                    >
                        {t("submit")}
                    </Button>

                    <TextField
                        placeholder={t("enterNumber")}
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value)}
                        sx={{ width: 220 }}
                    />

                    <Button
                        variant="outlined"
                        onClick={handleCheckStatus}
                        sx={{ borderRadius: 3, color: "#0e3465" }}
                    >
                        {t("checkStatus")}
                    </Button>
                </Box>
            </Box>

            <Box component="footer" sx={{ textAlign: "center", py: 1, backgroundColor: "#0A2640", color: "#fff", mt: 5 }}>
                <Typography variant="body2">© Atamyn Amanaty, 2025</Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, my: 1 }}>
                    <Typography variant="body2">Алия Сагимбаева — <Link href="https://wa.me/77019997820" color="inherit" underline="hover">+7 701 999 78 20</Link></Typography>
                    <Typography variant="body2">Марфуза Сулейменова — <Link href="https://wa.me/77768284535" color="inherit" underline="hover">+7 776 828 45 35</Link></Typography>
                    <Typography variant="body2">Ардак Закиева — <Link href="https://wa.me/77768284534" color="inherit" underline="hover">+7 776 828 45 34</Link></Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
                    <Link href="https://www.instagram.com/ata.amanaty/?hl=ru" target="_blank" color="inherit">
                        <IconBrandInstagram stroke={2} />
                    </Link>
                    <Link href="https://www.facebook.com/groups/atamnyn.amanaty/" target="_blank" color="inherit">
                        <IconBrandFacebook stroke={2} />
                    </Link>
                </Box>
            </Box>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 3,
                        borderRadius: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2, color: "#c13b3b", fontWeight: "bold" }}>
                        {t("error")}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{modalMessage}</Typography>
                    <Button variant="contained" onClick={() => setOpenModal(false)}>{t("close")}</Button>
                </Box>
            </Modal>
        </Box>
    );
}
