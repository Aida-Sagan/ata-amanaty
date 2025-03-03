"use client";

import { useState, useEffect } from "react";
import {useParams, useRouter} from "next/navigation";
import {
    Container, Typography, TextField,Modal, Button, Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox
} from "@mui/material";
import { IconNotes, IconAlertSquareRounded } from '@tabler/icons-react';
import axios from "axios";
import StatusChangeAlert from "@/components/alert";
import { SelectChangeEvent } from "@mui/material";


interface RequestData {
    _id: string;
    lastName: string;
    firstName: string;
    middleName?: string;
    birthDate: string;
    birthPlaceCountryRegion: string;
    birthPlaceCity: string;
    conscriptionDate: string;
    maritalStatus: string;
    childrenNames?: string;
    relativesListed?: string;
    prisoner: boolean;
    prisonerInfo?: string;
    searcherFullName: string;
    phoneNumber: string;
    homeAddress?: string;
    email: string;
    heardAboutUs: string;
    heardAboutUsOther?: string;
    status: string;
}


export default function AdminRequestPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [status, setStatus] = useState("");
    const [openModal, setOpenModal] = useState(false); // Состояние модального окна


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
            await axios.put(`/api/requests`, { id, ...requestData });
            setOpenModal(true); // Показываем модальное окно
        } catch (error) {
            console.error("Ошибка при сохранении данных:", error);
        }
    };
    const handleCloseModal = () => {
        setOpenModal(false);  // Закрываем модалку
        router.push("/admin"); // Переходим в админ-панель
    };

    const handleUpdateStatus = async (event: SelectChangeEvent) => {
        const newStatus = event.target.value;
        try {
            await axios.put(`/api/requests`, { id, status: newStatus });

            setStatus(newStatus);
            setShowAlert(true); // Показываем алерт сразу
            setRequestData(prev => (prev ? { ...prev, status: newStatus } : prev));

            setTimeout(() => {
                setShowAlert(false);
            }, 7000);
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
        }
    };


    const statusColors: Record<string, string> = {
        "В обработке": "bg-yellow-lt",
        "В процессе": "bg-blue-lt",
        "Найдена": "bg-green-lt",
        "Отклонена": "bg-red-lt",
    };


    if (loading) {
        return <Typography sx={{ mt: 4, fontSize: "1.2rem" }}>Загрузка...</Typography>;
    }


    return (

        <Container maxWidth="lg" >
            {showAlert && <StatusChangeAlert newStatus={status} />}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 4,
                    mt: 4,
                    marginLeft: 2,
                }}

            >
                <Button variant="contained" onClick={() => router.back()} sx={{ mb: 2 }}>
                    Назад
                </Button>
                {/* Левая часть: Форма с заявкой */}
                <Box
                    sx={{
                        flex: 1, // Занимает всю доступную ширину, но делится с другим Box
                        border: "1px solid #c8d3e1", // Цвет границы
                        padding: 3,
                        borderRadius: 2,
                        typography: "body1",
                        display: "flex",
                        flexDirection: "column",
                        width: "50%", // Ширина бокса
                        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
                        mb: '25px',
                    }}
                >

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                        <IconNotes stroke={2} size={40} />
                        Заявка под номером: {requestData?._id}
                        <div>
                            <span className={`badge ${statusColors[requestData?.status || ""]}`}>{requestData?.status}</span>
                        </div>
                    </Typography>


                    <TextField label="Фамилия" name="lastName" value={requestData?.lastName} onChange={handleChange}
                               fullWidth sx={{mb: 2}}/>
                    <TextField label="Имя" name="firstName" value={requestData?.firstName} onChange={handleChange}
                               fullWidth sx={{ mb: 2 }} />
                    <TextField label="Отчество" name="middleName" value={requestData?.middleName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Дата рождения" type="date" name="birthDate" value={requestData?.birthDate} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Место рождения (Страна, Область)" name="birthPlaceCountryRegion" value={requestData?.birthPlaceCountryRegion} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Место рождения (Город, Район)" name="birthPlaceCity" value={requestData?.birthPlaceCity} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Дата призыва" type="month" name="conscriptionDate" value={requestData?.conscriptionDate} onChange={handleChange} fullWidth sx={{ mb: 2 }} />

                    {/* Был ли в плену */}
                    <FormControlLabel
                        control={<Checkbox name="prisoner" checked={requestData?.prisoner} onChange={handleCheckboxChange} />}
                        label="Был ли в плену?"
                    />
                    {requestData?.prisoner && (
                        <TextField label="Где был пленен?" name="prisonerInfo" value={requestData?.prisonerInfo} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    )}

                    <TextField label="ФИО заявителя" name="searcherFullName" value={requestData?.searcherFullName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Номер телефона" name="phoneNumber" value={requestData?.phoneNumber} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Домашний адрес" name="homeAddress" value={requestData?.homeAddress} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label="Электронная почта" name="email" value={requestData?.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />

                    {/* Откуда узнали о нас */}
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
                        <TextField label="Укажите источник" name="heardAboutUsOther" value={requestData?.heardAboutUsOther} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    )}

                    {/*<Typography variant="h6">Загруженные файлы</Typography>*/}
                    {/*{requestData.attachments?.length > 0 ? (*/}
                    {/*    requestData.attachments.map((fileUrl: string, index: number) => (*/}
                    {/*        <Box key={index} sx={{ mt: 1 }}>*/}
                    {/*            <a href={fileUrl} target="_blank" rel="noopener noreferrer">{`Файл ${index + 1}`}</a>*/}
                    {/*        </Box>*/}
                    {/*    ))*/}
                    {/*) : (*/}
                    {/*    <Typography variant="body2" color="textSecondary">Файлы не загружены</Typography>*/}
                    {/*)}*/}

                </Box>

                {/* Правая часть: Статус заявки */}
                <Box
                    sx={{
                        flex: 0.5,
                        border: '1px solid #575C69',
                        padding: '35px',
                        boxShadow: 3,
                        borderRadius: '20px',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold', color: '#b88943' }}>
                        <IconAlertSquareRounded stroke={2} />
                        Статус заявки
                    </Typography>

                    {/* Выпадающий список для изменения статуса */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Изменить статус</InputLabel>
                        <Select
                            name="status"
                            value={requestData?.status}
                            onChange={handleUpdateStatus}
                        >
                            <MenuItem value="В обработке">В обработке</MenuItem>
                            <MenuItem value="В процессе">В процессе</MenuItem>
                            <MenuItem value="Найдена">Найдена</MenuItem>
                            <MenuItem value="Отклонена">Отклонена</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Кнопка сохранения */}
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Сохранить
                    </Button>
                </Box>
            </Box>
            {/* Модальное окно подтверждения */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>✅ Изменения сохранены</Typography>
                    <Button variant="contained" color="primary" onClick={handleCloseModal}>
                        Закрыть
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}
