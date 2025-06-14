"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Container, Typography, TextField, Modal, Button, Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Snackbar
} from "@mui/material";
import { IconNotes, IconAlertSquareRounded } from '@tabler/icons-react';
import axios from "axios";
import StatusChangeAlert from "@/components/alert";
import { SelectChangeEvent } from "@mui/material";
import Image from "next/image";
import "@/styles/global.css";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


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
    heardAboutUs: string;
    heardAboutUsOther?: string;
    status: string;
    adminComment?: string;
    filesLink?: string;

}

export default function AdminRequestPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [status, setStatus] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [deleteErrorOpen, setDeleteErrorOpen] = useState(false);


    useEffect(() => {
        axios.get(`/api/requests?id=${id}`)
            .then(response => {
                setRequestData(response.data.data);
                setLoading(false);
            })
            .catch(error => console.error("Ошибка загрузки заявки:", error));
    }, [id]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (requestData) {
            setRequestData({ ...requestData, [event.target.name]: event.target.value });
        }
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        if (requestData) {
            setRequestData({ ...requestData, [event.target.name]: event.target.value });
        }
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (requestData) {
            setRequestData({ ...requestData, [event.target.name]: event.target.checked });
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`/api/requests`, { id, ...requestData });
            setRequestData(response.data.data);
            setOpenModal(true);
        } catch (error) {
            console.error("Ошибка при сохранении данных:", error);
        }
    };


    const handleCloseModal = () => {
        setOpenModal(false);
        router.push("/admin");
    };

    const handleUpdateStatus = async (event: SelectChangeEvent) => {
        const newStatus = event.target.value;
        try {
            await axios.put(`/api/requests`, { id, status: newStatus });

            setStatus(newStatus);
            setShowAlert(true);
            setRequestData(prev => (prev ? { ...prev, status: newStatus } : prev));

            setTimeout(() => {
                setShowAlert(false);
            }, 7000);
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
        }
    };

    const buildPlainText = useCallback((data: Partial<RequestData>) => {
        const out: string[] = [];

        /** Удобный помощник: не добавляем пустые поля */
        const add = (label: string, value: unknown) => {
        if (value !== undefined && value !== null && value !== '') {
            out.push(`${label}: ${value}`);
        }
        };

        add('Кого ищут', data.lookingFor);
        add('Вернулся ли с войны', data.returnedFromWar);
        add('Фамилия', data.lastName);
        add('Имя', data.firstName);
        add('Отчество', data.middleName);
        add('Дата рождения', data.birthDate);
        add('Страна рождения', data.birthCountry);
        add('Область рождения', data.birthRegion);
        add('Город / район рождения', data.birthPlaceCity);
        add('Дата призыва', data.conscriptionDate);
        add('Место призыва', data.conscriptionPlace);
        add('Семейный статус', data.maritalStatus);
        add('Имена родственников', data.relativesListed);
        add('Дети', data.childrenNames);
        if (data.prisoner) {
        add('Был в плену', 'Да');
        add('Где был пленён', data.prisonerInfo);
        } else {
        add('Был в плену', 'Нет');
        }
        add('ФИО заявителя', data.searcherFullName);
        add('Телефон', data.phoneNumber);
        add('Домашний адрес', data.homeAddress);
        add('Область заявителя', data.applicationRegion);
        add('Страна подачи', data.applicationCountry);
        add('E-mail', data.email);
        add('Цель поиска', data.searchGoal);
        add('Ссылка на файлы', data.filesLink);
        add('Искали в архивах', data.archiveSearch);
        add('Найдено в архивах', data.archiveDetails);
        add('Доп. информация', data.additionalInfo);
        add('Откуда узнали', data.heardAboutUs);

        return out.join('\n');
    }, []);

  /* --------------------- копирование в буфер --------------------- */
    const handleCopy = () => {
        if (!requestData) return;
        const plain = buildPlainText(requestData);


        // современный API есть + безопасный контекст
        if (navigator.clipboard?.writeText && window.isSecureContext) {
            navigator.clipboard
            .writeText(plain)
            .then(() => setCopied(true))
            .catch(err => {
                console.error('Clipboard error', err);
                fallbackCopy(plain);
            });
        } else {
            // используем запасной вариант
            fallbackCopy(plain);
        }
        };

        function fallbackCopy(text: string) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';   // чтобы не прыгал экран
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const ok = document.execCommand('copy');
            setCopied(ok);
        } catch (err) {
            console.error('Fallback copy failed', err);
        } finally {
            document.body.removeChild(textarea);
        }
    }
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

    const handleDelete = () => {
        setDeleteErrorOpen(true);
    };


    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/requests?id=${id}`);
            router.push("/admin");
        } catch (error) {
            console.error("Ошибка при удалении заявки:", error);
            alert("Не удалось удалить заявку. Попробуйте позже.");
        } finally {
            setDeleteErrorOpen(false);
        }
    };



    if (loading) {
        return <Typography sx={{ mt: 4, fontSize: "1.2rem" }}>Загрузка...</Typography>;
    }

    return (
        <Container maxWidth="lg">
            {showAlert && <StatusChangeAlert newStatus={status} />}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 4, mt: 4, marginLeft: 2 }}>

                <Box sx={{ flex: 1, border: "1px solid #c8d3e1", padding: 3, borderRadius: 2, typography: "body1", display: "flex", flexDirection: "column", width: "50%", boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)", mb: '25px' }}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Image src="/logo.png" alt="Logo" width={200} height={110} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold",  }}>
                        <IconNotes stroke={2} size={40} />
                        Заявка под номером: {requestData?._id}
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 4}}>
                            <span className={`badge ${statusColors[requestData?.status || ""]}`}>{requestData?.status}</span>
                        </div>
                    </Typography>

                    <TextField label="Кого ищут" name="lookingFor" value={requestData?.lookingFor || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Вернулся ли с войны" name="returnedFromWar" value={requestData?.returnedFromWar || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Фамилия" name="lastName" value={requestData?.lastName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Имя" name="firstName" value={requestData?.firstName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Отчество" name="middleName" value={requestData?.middleName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField  name="birthDate" value={requestData?.birthDate || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Страна рождения" name="birthCountry" value={requestData?.birthCountry || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Область рождения" name="birthRegion" value={requestData?.birthRegion || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Город, район" name="birthPlaceCity" value={requestData?.birthPlaceCity} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Дата призыва" name="conscriptionDate" value={requestData?.conscriptionDate || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Место призыва" name="conscriptionPlace" value={requestData?.conscriptionPlace || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Семейный статус" name="maritalStatus" value={requestData?.maritalStatus || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Имена родителей, родственников, жены, сестер, братьев" name="relativesListed" value={requestData?.relativesListed || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Дети и их имена" name="childrenNames" value={requestData?.childrenNames || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <FormControlLabel control={<Checkbox name="prisoner" checked={requestData?.prisoner || false} onChange={handleCheckboxChange} />} label="Был ли в плену?" />
                    {requestData?.prisoner && (
                        <TextField label="Где был пленен?" name="prisonerInfo" value={requestData?.prisonerInfo} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    )}
                    <TextField label="ФИО заявителя" name="searcherFullName" value={requestData?.searcherFullName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Номер телефона" name="phoneNumber" value={requestData?.phoneNumber} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Домашний адрес" name="homeAddress" value={requestData?.homeAddress || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Область заявителя" name="applicationRegion" value={requestData?.applicationRegion || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Страна подачи заявки" name="applicationCountry" value={requestData?.applicationCountry || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Электронная почта" name="email" value={requestData?.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Цель поиска" name="searchGoal" value={requestData?.searchGoal || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField
                        label="Ссылка на файлы"
                        name="filesLink"
                        value={requestData?.filesLink || ""}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: requestData?.filesLink ? (
                                <Button
                                    href={requestData.filesLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        backgroundColor: 'rgba(7,49,104,0.36)',
                                        color: "#fff",
                                        p: 1,
                                        '&:hover': {
                                            backgroundColor: 'rgba(7,49,104,0.7)',
                                            color: "#fff",
                                        }
                                    }}
                                >
                                    Открыть
                                </Button>

                            ) : null
                        }}
                    />

                    <TextField
                        label="Искали ли в архивах?"
                        name="archiveSearch"
                        value={requestData?.archiveSearch || ""}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        minRows={2}
                        sx={{ mb: 2 }}
                        InputProps={{
                            sx: { resize: "vertical" }
                        }}
                    />
                    <TextField
                        label="Какие данные найдены"
                        name="archiveDetails"
                        value={requestData?.archiveDetails || ""}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        minRows={2}
                        sx={{ mb: 2 }}
                        InputProps={{
                            sx: { resize: "vertical" }
                        }}
                    />
                    <TextField
                        label="Дополнительная информация"
                        name="additionalInfo"
                        value={requestData?.additionalInfo || ""}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        minRows={4}
                        sx={{ mb: 2 }}
                        InputProps={{
                            sx: { resize: "vertical" }
                        }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Откуда узнали о нас?</InputLabel>
                        <Select name="heardAboutUs" value={requestData?.heardAboutUs || ""} onChange={handleSelectChange}>
                            <MenuItem value="Instagram">Instagram</MenuItem>
                            <MenuItem value="Facebook">Facebook</MenuItem>
                            <MenuItem value="TikTok">TikTok</MenuItem>
                            <MenuItem value="friends">От знакомых</MenuItem>
                            <MenuItem value="internetSearch">Поиск в интернете</MenuItem>
                            <MenuItem value="other">Другое</MenuItem>
                        </Select>
                    </FormControl>
                    {requestData?.heardAboutUs === "other" && (
                        <TextField label="Укажите источник" name="heardAboutUsOther" value={requestData?.heardAboutUsOther || ""} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    )}
                </Box>

                <Box sx={{display:'flex', flexDirection:'column'}}>
                    <Button variant="contained" onClick={() => router.back()} sx={{ mb: 2 , borderRadius: 4 }}>
                        Назад
                    </Button>
                    <Box sx={{ flex: 0.5, border: '1px solid #575C69', padding: '35px', boxShadow: 3, borderRadius: '20px', display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold', color: '#b88943' }}>
                            <IconAlertSquareRounded stroke={2} />
                            Статус заявки
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 2}}>
                            <InputLabel>Изменить статус</InputLabel>
                            <Select name="status" value={requestData?.status} onChange={handleUpdateStatus} >
                                <MenuItem value="На стадии рассмотрения">На стадии рассмотрения</MenuItem>
                                <MenuItem value="В процессе поиска">В процессе поиска</MenuItem>
                                <MenuItem value="Недостаточно данных">Недостаточно данных</MenuItem>
                                <MenuItem value="Не найдены документы в ЦАМО">Не найдены документы в ЦАМО</MenuItem>
                                <MenuItem value="Найдено частично">Найдено частично</MenuItem>
                                <MenuItem value="Найдено">Найдено</MenuItem>
                                <MenuItem value="Передано в архив">Передано в архив</MenuItem>
                                <MenuItem value="Ожидает ответа от заявителя">Ожидает ответа от заявителя</MenuItem>
                                <MenuItem value="Обратиться для увековечивания">
                                    Обратиться для увековечивания
                                </MenuItem>

                            </Select>
                        </FormControl>

                        <Button  variant="outlined" sx={{ color: "#555", borderRadius: 2 }} onClick={handleSave}>
                            Сохранить
                        </Button>
                    </Box>

                    <Box sx={{ flex: 0.5, border: '1px solid #575C69', padding: '35px', boxShadow: 3, borderRadius: '20px', display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
                        <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold', color: '#062645' }}>
                            <IconAlertSquareRounded stroke={2} />
                            Комментарий администратора
                        </Typography>
                        <TextField
                            label="Комментарий администратора"
                            value={requestData?.adminComment || ""} // показывается, если есть
                            onChange={(e) =>
                                setRequestData((prev) =>
                                    prev ? { ...prev, adminComment: e.target.value } : prev
                                )
                            }
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ mb: 2 }}
                        />

                        <Button variant="outlined" sx={{ color: "#555", borderRadius: 2 }} onClick={handleSave}>
                            Сохранить
                        </Button>
                    </Box>

                    <Box sx={{ p: 2, border: "1px solid #0f172a", borderRadius: 4, boxShadow: 2, backgroundColor: "rgb(251,250,232)", maxWidth: 400, mt:2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold", color: "#004991" }}>
                            <IconAlertSquareRounded stroke={2} style={{ marginRight: "8px" }} />
                            Что означает статус заявки
                        </Typography>

                        {[
                            "На стадии рассмотрения — заявка только поступила, ещё не обработана.",
                            "В процессе поиска — заявка обрабатывается, ведётся активный поиск.",
                            "Недостаточно данных — сведений недостаточно для начала поиска, нужно уточнение от заявителя.",
                            "Не найдены документы в ЦАМО — по заявке сделан запрос, но в Центральном архиве Министерства обороны РФ ничего не найдено.",
                            "Найдено частично — найдены отдельные сведения, но нет полной информации.",
                            "Найдено — найдены документы и подтверждения, заявка успешно закрыта.",
                            "Передано в архив — заявка закрыта и перенесена в архив (например, после долгого времени без ответа).",
                            "Ожидает ответа от заявителя — заявителю отправлен запрос на уточнение, но ответ пока не получен.",
                            "Рекомендовано обратиться в администрацию по месту захоронения для увековечивания."
                        ].map((text, idx) => (
                            <Accordion key={idx} sx={{ bgcolor: "transparent" }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography sx={{ fontWeight: "bold" }}>{text.split(" — ")[0]}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2">{text}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleCopy}
                        sx={{ mt: 5,mb: 3, backgroundColor: 'rgba(7,49,104,0.8)', borderRadius: 5 }}
                    >
                        Скопировать текст заявки
                    </Button>

                    {/* Тост-уведомление */}
                    <Snackbar
                        open={copied}
                        autoHideDuration={3000}
                        message="Скопировано в буфер обмена"
                        onClose={() => setCopied(false)}
                    />

                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ mt: 2, borderRadius: 4 }}
                    >
                        Удалить заявку
                    </Button>

                </Box>
            </Box>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '10px', textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>✅ Изменения сохранены</Typography>
                    <Button variant="contained" color="primary" onClick={handleCloseModal}>
                        Закрыть
                    </Button>
                </Box>
            </Modal>

            <Dialog open={deleteErrorOpen} onClose={() => setDeleteErrorOpen(false)}>
                <DialogTitle sx={{ fontWeight: "bold", color: "#c62828" }}>
                    Вы уверены, что хотите удалить эту заявку?
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Это действие необратимо.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDelete} color="error">
                        Да, удалить
                    </Button>
                    <Button onClick={() => setDeleteErrorOpen(false)} autoFocus>
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>


        </Container>
    );
}
