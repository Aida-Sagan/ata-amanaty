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
import { IconBrandTelegram } from "@tabler/icons-react";


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
                const rawStats = response.data.data;

                setStatistics({
                    totalApplications: rawStats.totalApplications + 10286,
                    foundPeople: rawStats.foundPeople + 1957,
                    regions: rawStats.regions,
                    countries: rawStats.countries,
                });

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

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        sx={{
                            flexDirection: "row",
                            "@media (max-width:760px)": {
                                flexDirection: "column",
                                alignItems: "flex-start"
                            }
                        }}
                    >
                        {/*<Button*/}
                        {/*    variant="text"*/}
                        {/*    href="https://ata-amanaty.framer.website/"*/}
                        {/*    target="_blank"*/}
                        {/*    rel="noopener noreferrer"*/}
                        {/*    sx={{ textTransform: "none", fontWeight: 500 }}*/}
                        {/*>*/}
                        {/*    { t('website')}*/}
                        {/*</Button>*/}

                        <Select
                            value={language === "ru" ? "Русский" : "Қазақша"}
                            sx={{ minWidth: 170, height: '35px'}}
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
                            <Typography variant="h3" sx={{ mt: 1, fontWeight: 600, color: "#084377" }}>{loading ? "..." : statistics.totalApplications}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ width: 260, p: 2, borderRadius: 3, boxShadow: 2 }}>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Typography variant="h6" >{t("found")}</Typography>
                            <Typography variant="h3" sx={{ mt: 1, fontWeight: 600, color: "#4b9166"  }}>{loading ? "..." : statistics.foundPeople}</Typography>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#1976d2", color: "#ffffff", fontWeight: "bold", borderRadius: 3,
                            "&:hover": {
                                backgroundColor: "#125ea3",
                            }
                    }}
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

            <Box
                sx={{
                    mt: 5,
                    p: 3,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: 900,
                    mx: "auto"
                }}
            >
                {language === "ru" ? (
                    <>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                            Обращение от общественного объединения «Атамның аманаты»
                        </Typography>

                        <Typography variant="body1" paragraph>
                            Дорогие потомки дедов и прадедов, воевавших в ВОВ, второй мировой войне!
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Те, кто подал заявки общественному обьединению «Атамның аманаты» на поиск без вести пропавших предков:
                        </Typography>
                        <ul>
                            <li><Typography variant="body1">Ваша заявка принята, зарегистрирована в нашем списке и наши поисковики приступят к поиску в архивах сведений о вашем деде/прадеде.</Typography></li>
                        </ul>
                        <Typography variant="body1" paragraph>В связи с этим хочу дать некоторые разъяснения:</Typography>
                        <ul>
                            <li><Typography variant="body1">Все документы и данные по войне находятся в российских архивах. По нашим сведениям, они пока полностью не открыты.</Typography></li>
                            <li><Typography variant="body1">Когда откроются — неизвестно. Возможно, данных о вашем предке там не будет. Есть архивы, которые вообще не будут рассекречены.</Typography></li>
                            <li><Typography variant="body1">Не обещаем найти точное место захоронения вашего деда/прадеда.</Typography></li>
                            <li><Typography variant="body1">Но мы продолжаем поиски. Архивы всё больше оцифровываются.</Typography></li>
                            <li><Typography variant="body1">Мы волонтёры и работаем в свободное время. Если не связываемся — значит пока нет новостей.</Typography></li>
                        </ul>
                        <Typography variant="body1" paragraph>
                            Мы делаем это ради памяти. Мы не имеем права забывать. Это наша миссия.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            От имени объединения «Атамның аманаты» выражаем вам соболезнования. Светлая память вашим дедам.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Спасибо и вам, потомкам. Вы помните, вы ищете.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Сделаем всё возможное, чтобы вернуть имена 271 503 пропавших без вести казахстанцев.
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ fontWeight: "bold" }}>
                            Мира и благополучия всем вашим семьям!
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
                            С уважением, Алия Сагимбаева, учредитель ОО «Атамның аманаты», Астана.
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                            «Атамның аманаты» қоғамдық бірлестігінің үндеуі
                        </Typography>

                        <Typography variant="body1" paragraph>
                            Құрметті батыр аталарымыздың ұрпақтары!
                        </Typography>
                        <Typography variant="body1" paragraph>
                            1939–1945 жж соғыста хабар-ошарсыз кеткен аталарын іздеуге өтініш бергендерге:
                        </Typography>
                        <ul>
                            <li><Typography variant="body1">Өтінішіңіз қабылданып, тіркелді. Іздеушілеріміз мұрағаттан ақпарат іздеуге кіріседі.</Typography></li>
                        </ul>
                        <Typography variant="body1" paragraph>Біраз түсініктеме берейік:</Typography>
                        <ul>
                            <li><Typography variant="body1">Құжаттар Ресей мұрағаттарында сақтаулы. Олар толық ашылмаған.</Typography></li>
                            <li><Typography variant="body1">Қашан ашылатыны белгісіз. Ашылған күннің өзінде дерек болмауы мүмкін.</Typography></li>
                            <li><Typography variant="body1">Жерленген жерді анықтап бере алатынымызға кепілдік жоқ.</Typography></li>
                            <li><Typography variant="body1">Дегенмен, іздеуді жалғастырамыз. Мұрағаттар оцифрланып жатыр.</Typography></li>
                            <li><Typography variant="body1">Іздеушілер хабарласпаса — ренжімеңіздер. Біз бәріміз еріктіміз, бос уақытымызда жұмыс істейміз.</Typography></li>
                        </ul>
                        <Typography variant="body1" paragraph>
                            Біз не үшін мұндай күрделі жұмыспен айналысып жүргенімізді жақсы түсінеміз. Біз батыр аталарымыздың есімдерін қайта жаңғыртуымыз керек!
                        </Typography>
                        <Typography variant="body1" paragraph>
                            «Атамның аманаты» атынан, бүкіл қазақ халқының атынан көңіл айтамыз.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Ерлікпен қаза тапқан ата-бабаларымыздың рухтарына тағзым етеміз. Жарық жұлдыздай жандары тыныш болсын.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Сіздерге де мың алғыс — ұмытпай, аманатқа адал болып, іздеп жатқандарыңыз үшін.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            271 503 хабар-ошарсыз кеткен қазақ жауынгерінің есімін қайта жаңғыртамыз.
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ fontWeight: "bold" }}>
                            Еліміз аман, жұртымыз тыныш болсын!
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
                            Құрметпен, Әлия Нұрпақызы Сағымбаева, «Атамның аманаты» қоғамдық бірлестігінің құрылтайшысы, Астана.
                        </Typography>
                    </>
                )}
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


            <Box component="footer" sx={{ textAlign: "center", py: 1, backgroundColor: "#0A2640", color: "#fff", mt: 5 }}>
                <Typography variant="body2">© Atamnyn Amanaty, 2025</Typography>

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
