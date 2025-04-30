"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Typography,
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Button
} from "@mui/material";
import axios from "axios";
import { IconAlertSquareRounded, IconChartBubble, IconMail } from "@tabler/icons-react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import "@/styles/global.css";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


interface RequestData {
    _id: string;
    lookingFor?: string;
    returnedFromWar?: string;
    lastName: string;
    firstName: string;
    middleName?: string;
    birthDate: string;
    birthCountry?: string;
    birthRegion?: string;
    birthPlaceCity: string;
    conscriptionDate?: string;
    conscriptionPlace?: string;
    maritalStatus?: string;
    childrenNames?: string;
    relativesListed?: string;
    prisoner: boolean;
    prisonerInfo?: string;
    searcherFullName: string;
    phoneNumber: string;
    homeAddress?: string;
    applicationRegion?: string;
    applicationCountry?: string;
    email: string;
    searchGoal?: string;
    archiveSearch?: string;
    archiveDetails?: string;
    additionalInfo?: string;
    heardAboutUs?: string;
    heardAboutUsOther?: string;
    status: string;
    adminComment?: string;
    filesLink?: string;
}

const fieldLabels: Record<keyof RequestData, string> = {
    _id: "ID",
    lookingFor: "Кого ищете",
    returnedFromWar: "Вернулся ли с войны",
    lastName: "Фамилия",
    firstName: "Имя",
    middleName: "Отчество",
    birthDate: "Дата рождения",
    birthCountry: "Страна рождения",
    birthRegion: "Область рождения",
    birthPlaceCity: "Город/Район рождения",
    conscriptionDate: "Дата призыва",
    conscriptionPlace: "Место призыва",
    maritalStatus: "Семейное положение",
    childrenNames: "Дети",
    relativesListed: "Перечислены родственники",
    prisoner: "Был ли в плену",
    prisonerInfo: "Где был пленен",
    searcherFullName: "ФИО заявителя",
    phoneNumber: "Телефон",
    homeAddress: "Адрес проживания",
    applicationRegion: "Регион подачи заявки",
    applicationCountry: "Страна подачи заявки",
    email: "Электронная почта",
    searchGoal: "Цель поиска",
    archiveSearch: "Архивный поиск",
    archiveDetails: "Детали архивного поиска",
    additionalInfo: "Дополнительная информация",
    heardAboutUs: "Как узнали о нас",
    heardAboutUsOther: "Уточните источник",
    status: "Статус",
    adminComment: "Комментарий администратора",
    filesLink: "Ссылка на файлы",

};

export default function StatusPage() {
    const router = useRouter();
    const { requestNumber } = useParams();
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useLanguage();


    useEffect(() => {
        const fetchRequestData = async () => {
            try {
                const response = await axios.get(`/api/requests?id=${requestNumber}`);
                if (response.data.success) {
                    setRequestData(response.data.data);
                } else {
                    setError("Заявка не найдена.");
                }
            } catch (err) {
                console.error(err);
                setError("Ошибка при загрузке заявки.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequestData();
    }, [requestNumber]);

    const statusColors: Record<string, string> = {
        "На стадии рассмотрения": "bg-yellow-lt",
        "В процессе поиска": "bg-blue-lt",
        "Недостаточно данных": "bg-orange-lt",
        "Не найдены документы в ЦАМО": "bg-gray-lt",
        "Найдено частично": "bg-teal-lt",
        "Найдено": "bg-green-lt",
        "Передано в архив": "bg-indigo-lt",
        "Ожидает ответа от заявителя": "bg-cyan-lt",
        "Обратиться для увековечивания": "bg-lime-lt"

    };

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4, px: 2, maxWidth: 1400, mx: "auto" }}>
            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
                <Box sx={{ flex: 1, border: "1px solid #c8d3e1", p: 3, borderRadius: 2, boxShadow: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Image src="/logo.png" alt="Logo" width={200} height={110} onClick={() => router.back()} style={{ cursor: "pointer" }} />
                    </Box>
                    <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>Заявка №: {requestNumber}</Typography>
                    {Object.entries(requestData || {}).map(([key, value]) => (
                        key !== "prisoner" &&
                        key !== "prisonerInfo" &&
                        key !== "status" &&
                        key !== "adminComment" &&
                        fieldLabels[key as keyof RequestData] && (
                            <TextField key={key} label={fieldLabels[key as keyof RequestData]} value={value as string} fullWidth sx={{ mb: 2 }} disabled />
                        )
                    ))}
                    <FormControlLabel control={<Checkbox checked={requestData?.prisoner} disabled />} label="Был ли в плену?" />
                    {requestData?.prisoner && (
                        <TextField label="Где был пленен?" value={requestData?.prisonerInfo} fullWidth sx={{ mb: 2 }} disabled />
                    )}
                </Box>

                <Box sx={{ width: 400, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Button variant="contained" fullWidth onClick={() => router.back()}>{t("backToHome")}</Button>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, border: "1px solid #0f172a", borderRadius: 2, boxShadow: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold"}}>
                            <IconChartBubble stroke={2} style={{ marginRight: "8px" }} />
                            {t('statusTitle')}:
                        </Typography>
                        <span className={`badge ${statusColors[requestData?.status?.trim() || ""] }`} style={{fontSize: "11px"}}>
                          {requestData?.status || "Неизвестно"}
                        </span>
                    </Box>

                    <Box sx={{ p: 2, border: "1px solid #575C69", boxShadow: 2, borderRadius: 2, backgroundColor: "#f9fafb", mt:7 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold", color: "#062645" }}>
                            <IconMail stroke={2} style={{ marginRight: "8px" }} />{t("adminComment")}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-line",wordBreak: "break-word",
                            overflowWrap: "break-word",
                        }}>
                            {requestData?.adminComment || t("noAdminComment")}
                        </Typography>
                    </Box>
                    <Box sx={{ p: 2, border: "1px solid #0f172a", borderRadius: 2, boxShadow: 2, backgroundColor: "rgba(255,255,255,0.18)" }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold", color: "#004991" }}>
                            <IconAlertSquareRounded stroke={2} style={{ marginRight: "8px" }} />{t("questionsContact")}
                        </Typography>
                        <Typography variant="body2">Алия Сагимбаева — 8-701-999-78-20</Typography>
                        <Typography variant="body2">Марфуза Сулейменова — 8-776-828-45-35</Typography>
                        <Typography variant="body2">Закиева Ардак — +7 (776) 828-45-34</Typography>
                    </Box>

                    <Box sx={{ p: 2, border: "1px solid #0f172a", borderRadius: 2, boxShadow: 2, backgroundColor: "rgb(241,251,238)" }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold", color: "#004991" }}>
                            <IconAlertSquareRounded stroke={2} style={{ marginRight: "8px" }} />{t("definition")}
                        </Typography>

                        {[
                            {
                                ru: "На стадии рассмотрения — заявка только поступила, ещё не обработана.",
                                kk: "Қаралу сатысында — өтініш енді ғана қабылданды, әлі өңделмеген."
                            },
                            {
                                ru: "В процессе поиска — заявка обрабатывается, ведётся активный поиск.",
                                kk: "Іздеу процесінде — өтініш өңделіп жатыр, белсенді іздеу жүргізілуде."
                            },
                            {
                                ru: "Недостаточно данных — сведений недостаточно для начала поиска, нужно уточнение от заявителя.",
                                kk: "Деректер жеткіліксіз — іздеуді бастау үшін мәлімет жеткіліксіз, өтініш берушіден нақтылау қажет."
                            },
                            {
                                ru: "Не найдены документы в ЦАМО — по заявке сделан запрос, но в Центральном архиве Министерства обороны РФ ничего не найдено.",
                                kk: "ҚР ҚМ архивінен құжат табылмады — сұраныс жасалды, бірақ РФ Қорғаныс министрлігінің орталық архивінен ештеңе табылған жоқ."
                            },
                            {
                                ru: "Найдено частично — найдены отдельные сведения, но нет полной информации.",
                                kk: "Жартылай табылды — кейбір деректер табылды, бірақ толық ақпарат жоқ."
                            },
                            {
                                ru: "Найдено — найдены документы и подтверждения, заявка успешно закрыта.",
                                kk: "Табылды — құжаттар мен дәлелдер табылды, өтініш сәтті аяқталды."
                            },
                            {
                                ru: "Передано в архив — заявка закрыта и перенесена в архив (например, после долгого времени без ответа).",
                                kk: "Мұрағатқа жіберілді — өтініш жабылды және мұрағатқа жіберілді (мысалы, ұзақ уақыт жауап болмаған жағдайда)."
                            },
                            {
                                ru: "Ожидает ответа от заявителя — заявителю отправлен запрос на уточнение, но ответ пока не получен.",
                                kk: "Өтініш берушінің жауабы күтілуде — өтініш берушіге нақтылау сұранысы жіберілді, бірақ жауап әлі жоқ."
                            },
                            {
                                ru: "Рекомендовано обратиться в администрацию по месту захоронения для увековечивания.",
                                kk: "Еске алу үшін әкімдікке жүгіну ұсынылады."
                            }
                        ].map((item, idx) => (
                            <Accordion key={idx} sx={{ bgcolor: "transparent" }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography sx={{ fontWeight: "bold" }}>{item.ru.split(" — ")[0]}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" sx={{ mb: 1 }}>{item.ru}</Typography>
                                    <Typography variant="body2" sx={{ color: "#00796b" }}>{item.kk}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>

                </Box>
            </Box>
        </Box>
    );
}
