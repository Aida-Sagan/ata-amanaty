"use client";

import { useEffect, useState } from "react";
import {useParams, useRouter} from "next/navigation";
import {
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "axios";

export default function StatusPage() {
    const router = useRouter(); // Хук для перехода между страницами

    const { requestNumber } = useParams(); // Получаем параметр ID заявки
    const [requestData, setRequestData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                setError("Ошибка при загрузке заявки.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequestData();
    }, [requestNumber]);

    const statusColors: any = {
        "В обработке": "bg-yellow-lt",
        "В процессе": "bg-blue-lt",
        "Найдена": "bg-green-lt",
        "Отклонена": "bg-red-lt"
    };

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 4,
            mt: 4,
            marginLeft: 2,
        }}>
            <Button variant="contained" onClick={() => router.back()}>
                На главную
            </Button>
            <Box
                sx={{
                    display: "flex",
                    gap: 3, // Отступ между ними
                    textAlign: "center"
                }}
            >
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
                        mb: '25px'
                    }}
                >

                <Typography variant="h4" sx={{color: '#313c52', mb: '20px',fontWeight: '700' }}>Заявка №: {requestNumber}</Typography>
                    <TextField label="Фамилия" name="lastName" value={requestData.lastName} fullWidth sx={{ mb: 2 }} disabled/>
                    <TextField label="Имя" name="firstName" value={requestData.firstName} fullWidth sx={{ mb: 2 }} disabled/>
                    <TextField label="Отчество" name="middleName" value={requestData.middleName} fullWidth sx={{ mb: 2 }} disabled/>
                    <TextField label="Дата рождения" type="date" name="birthDate" value={requestData.birthDate} fullWidth sx={{ mb: 2 }} disabled/>
                    <TextField label="Место рождения (Страна, Область)" name="birthPlaceCountryRegion" value={requestData.birthPlaceCountryRegion} fullWidth sx={{ mb: 2 }} disabled/>
                    <TextField label="Место рождения (Город, Район)" name="birthPlaceCity" value={requestData.birthPlaceCity} fullWidth sx={{ mb: 2 }} disabled/>
                    <TextField label="Дата призыва" type="month" name="conscriptionDate" value={requestData.conscriptionDate} fullWidth sx={{ mb: 2 }} disabled/>

                    {/* Был ли в плену */}
                    <FormControlLabel
                        control={<Checkbox name="prisoner" checked={requestData.prisoner} disabled />}
                        label="Был ли в плену?"
                    />
                    {requestData.prisoner && (
                        <TextField label="Где был пленен?" name="prisonerInfo" value={requestData.prisonerInfo} fullWidth sx={{ mb: 2 }} disabled />
                    )}

                    <TextField label="ФИО заявителя" name="searcherFullName" value={requestData.searcherFullName} fullWidth sx={{ mb: 2 }} disabled/>
                    <TextField label="Номер телефона" name="phoneNumber" value={requestData.phoneNumber} fullWidth sx={{ mb: 2 }} disabled/>
                    <TextField label="Домашний адрес" name="homeAddress" value={requestData.homeAddress} fullWidth sx={{ mb: 2 }} disabled/>
                    <TextField label="Электронная почта" name="email" value={requestData.email} fullWidth sx={{ mb: 2 }} disabled/>

                    {/* Откуда узнали о нас */}
                    <FormControl fullWidth sx={{ mb: 2 }} disabled>
                        <InputLabel>Откуда узнали о нас?</InputLabel>
                        <Select name="heardAboutUs" value={requestData.heardAboutUs}>
                            <MenuItem value="Instagram">Instagram</MenuItem>
                            <MenuItem value="Facebook">Facebook</MenuItem>
                            <MenuItem value="TikTok">TikTok</MenuItem>
                            <MenuItem value="friends">От знакомых</MenuItem>
                            <MenuItem value="internetSearch">Поиск в интернете</MenuItem>
                            <MenuItem value="other">Другое</MenuItem>
                        </Select>
                    </FormControl>
                    {requestData.heardAboutUs === "other" && (
                        <TextField label="Укажите источник" name="heardAboutUsOther" value={requestData.heardAboutUsOther} fullWidth sx={{ mb: 2 }} />
                    )}
                    {/*<Typography variant="h6">Загруженные файлы</Typography>*/}
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
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",

                    }}
                >
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            mb: 2 ,
                            border: '1px solid #0f172a',
                            padding: '35px',
                            boxShadow: 3,
                            borderRadius: '20px',
                            backgroundColor: 'rgba(255,255,255,0.18)',
                    }}>
                          <p style={{fontWeight: '600', color: '#313c52'}}>Статус зявки:</p>
                        <span className={`badge ${statusColors[requestData.status]}`}>{requestData.status}</span>

                    </Typography>



                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            border: '1px solid #0f172a',
                            padding: '15px',
                            boxShadow: 3,
                            borderRadius: '20px',
                            fontSize: '14px',
                            backgroundColor: 'rgba(255,255,255,0.18)',
                        }}>
                        <p style={{fontWeight: '600', color: '#313c52'}}>По всем вопросам писать на номер:</p>
                        <p style={{color: '#313c52'}}>8 777 777 77 77</p>
                    </Typography>

                </Box>


                {/* Правая часть: кнопка скачивания заявки */}
                <Box
                    sx={{

                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",

                    }}
                >
                    <Button variant="contained" onClick={() => router.back()} sx={{ mb: 2 }} disabled>
                        Скачать заявку
                    </Button>
                </Box>

            </Box>

        </Box>
    );
}
