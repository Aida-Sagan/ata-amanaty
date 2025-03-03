"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Box, MenuItem, FormControl, InputLabel, Select, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import Image from "next/image";

export default function VerifyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [requestData, setRequestData] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState(true); // Добавляем индикатор загрузки данных

    // 📌 Функция загрузки данных заявки
    const fetchData = useCallback(async () => {
        const requestId = localStorage.getItem("requestId");
        if (!requestId) {
            router.push("/form");
            return;
        }

        try {
            const response = await axios.get(`/api/requests?id=${requestId}`);
            setRequestData(response.data.data);
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            alert("Не удалось загрузить заявку.");
            router.push("/form");
        } finally {
            setIsLoadingData(false);
        }
    }, [router]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRequestData({
            ...requestData,
            [event.target.name]: event.target.value as string
        });
    };

    const handleSelectChange = (event: any) => {
        setRequestData({ ...requestData, [event.target.name]: event.target.value });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRequestData({ ...requestData, [event.target.name]: event.target.checked });
    };

    // 📌 Функция обновления заявки
    const handleUpdate = async () => {
        if (!requestData?._id) {
            alert("Ошибка: ID заявки отсутствует.");
            return;
        }

        setLoading(true);
        try {
            await axios.put(`/api/requests`, {
                id: requestData._id,
                ...requestData, // Отправляем все данные заявки
            });

            router.push("/success-page");
        } catch (error) {
            console.error("Ошибка обновления:", error);
            alert("Ошибка при обновлении заявки.");
        } finally {
            setLoading(false);
        }
    };

    if (isLoadingData) {
        return <Typography align="center">Загрузка данных...</Typography>;
    }

    return (
        <Container maxWidth="md"
                   sx={{
                       flex: 1, // Занимает всю доступную ширину, но делится с другим Box
                       border: "1px solid #c8d3e1", // Цвет границы
                       padding: 3,
                       borderRadius: 2,
                       typography: "body1",
                       boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
                       mb: '4rem',
                       mt: '2rem'
                   }}
        >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Image src="/logo.png" alt="Logo" width={200} height={110} />
            </Box>
            <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: 'bold', color: '#756308'}}>
                Проверьте и подтвердите заявку
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField label="Фамилия" name="lastName" value={requestData.lastName} onChange={handleChange} fullWidth />
                <TextField label="Имя" name="firstName" value={requestData.firstName} onChange={handleChange} fullWidth />
                <TextField label="Отчество" name="middleName" value={requestData.middleName} onChange={handleChange} fullWidth />
                <TextField label="Дата рождения" type="date" name="birthDate" value={requestData.birthDate} onChange={handleChange} fullWidth />
                <TextField label="Место рождения (Страна, Область)" name="birthPlaceCountryRegion" value={requestData.birthPlaceCountryRegion} onChange={handleChange} fullWidth />
                <TextField label="Место рождения (Город, Район)" name="birthPlaceCity" value={requestData.birthPlaceCity} onChange={handleChange} fullWidth />
                <TextField label="Дата призыва" type="month" name="conscriptionDate" value={requestData.conscriptionDate} onChange={handleChange} fullWidth />

                {/* Семейное положение */}
                <FormControl fullWidth>
                    <InputLabel>Семейный статус</InputLabel>
                    <Select name="maritalStatus" value={requestData.maritalStatus} onChange={handleSelectChange}>
                        <MenuItem value="married">Женат / Замужем</MenuItem>
                        <MenuItem value="divorced">Разведен(-а)</MenuItem>
                        <MenuItem value="neverMarried">Никогда не состоял(-а) в браке</MenuItem>
                        <MenuItem value="widowWidower">Вдова / Вдовец</MenuItem>
                    </Select>
                </FormControl>

                <TextField label="Количество детей и их имена" name="childrenNames" value={requestData.childrenNames} onChange={handleChange} fullWidth />
                <TextField label="Родственники, которых мог указать" name="relativesListed" value={requestData.relativesListed} onChange={handleChange} fullWidth />

                {/* Бывший в плену */}
                <FormControlLabel
                    control={<Checkbox name="prisoner" checked={requestData.prisoner} onChange={handleCheckboxChange} />}
                    label="Был ли в плену?"
                />
                {requestData.prisoner && <TextField label="Где был пленен?" name="prisonerInfo" value={requestData.prisonerInfo} onChange={handleChange} fullWidth />}

                {/* Контактные данные */}
                <TextField label="ФИО заявителя" name="searcherFullName" value={requestData.searcherFullName} onChange={handleChange} fullWidth />
                <TextField label="Номер телефона" name="phoneNumber" value={requestData.phoneNumber} onChange={handleChange} fullWidth />
                <TextField label="Домашний адрес" name="homeAddress" value={requestData.homeAddress} onChange={handleChange} fullWidth />
                <TextField label="Электронная почта" name="email" value={requestData.email} onChange={handleChange} fullWidth />

                {/* Откуда узнали о нас */}
                <FormControl fullWidth>
                    <InputLabel>Откуда узнали о нас?</InputLabel>
                    <Select name="heardAboutUs" value={requestData.heardAboutUs} onChange={handleSelectChange}>
                        <MenuItem value="Instagram">Instagram</MenuItem>
                        <MenuItem value="Facebook">Facebook</MenuItem>
                        <MenuItem value="TikTok">TikTok</MenuItem>
                        <MenuItem value="friends">От знакомых</MenuItem>
                        <MenuItem value="internetSearch">Поиск в интернете</MenuItem>
                        <MenuItem value="other">Другое</MenuItem>
                    </Select>
                </FormControl>
                {requestData.heardAboutUs === "other" && (
                    <TextField label="Укажите источник" name="heardAboutUsOther" value={requestData.heardAboutUsOther} onChange={handleChange} fullWidth />
                )}

                {/* Кнопка "Подтвердить" */}
                <Button variant="contained" color="primary" onClick={handleUpdate} disabled={loading}>
                    {loading ? "Сохранение..." : "Подтвердить"}
                </Button>
            </Box>
        </Container>
    );
}
