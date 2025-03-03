"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Checkbox, FormControlLabel, Typography, Container, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Image from "next/image";

const schema: yup.ObjectSchema<FormDataType> = yup.object().shape({
    lookingFor: yup.string().required("Выберите, кого ищете"),
    returnedFromWar: yup.string().required("Выберите, вернулся ли человек с войны"),
    lastName: yup.string().required("Фамилия обязательна"),
    firstName: yup.string().required("Имя обязательно"),
    middleName: yup.string().optional(),
    birthDate: yup.string().required("Дата рождения обязательна"),
    birthPlaceCountryRegion: yup.string().required("Укажите место рождения (страна, область)"),
    birthPlaceCity: yup.string().required("Укажите место рождения (город, район)"),
    conscriptionDate: yup.string().required("Введите дату призыва"),
    maritalStatus: yup.string().required("Выберите семейный статус"),
    childrenNames: yup.string().optional(),
    relativesListed: yup.string().optional(),
    prisoner: yup.boolean().default(false),
    prisonerInfo: yup.string().optional(),
    searcherFullName: yup.string().required("ФИО обязательно"),
    phoneNumber: yup.string().required("Номер телефона обязателен"),
    homeAddress: yup.string().optional(),
    email: yup.string().email("Введите корректный email").required("Email обязателен"),
    heardAboutUs: yup.string().required("Выберите источник"),
    heardAboutUsOther: yup.string().optional(),
});


interface FormDataType {
    lookingFor: string;
    returnedFromWar: string;
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
}


export default function FormPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, register, watch, formState: { errors } } = useForm<FormDataType>({
        resolver: yupResolver(schema),
        defaultValues: {
            lookingFor: "",
            returnedFromWar: "",
            lastName: "",
            firstName: "",
            middleName: "",
            birthDate: "",
            birthPlaceCountryRegion: "",
            birthPlaceCity: "",
            conscriptionDate: "",
            maritalStatus: "",
            childrenNames: "",
            relativesListed: "",
            prisoner: false,
            prisonerInfo: "",
            searcherFullName: "",
            phoneNumber: "",
            homeAddress: "",
            email: "",
            heardAboutUs: "",
            heardAboutUsOther: "",
        },
    });

    const onSubmit = async (data: FormDataType) => {
        setLoading(true);
        try {
            const response = await axios.post("/api/requests", data);
            const requestId = response.data.data._id; // Получаем ID заявки

            // Сохраняем ID заявки в localStorage
            localStorage.setItem("requestId", requestId);

            // Перенаправляем пользователя на страницу `/verify`
            router.push("/verify");
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Ошибка отправки заявки.");
        }
        setLoading(false);
    };


    return (
        <Box
            sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 4,
            mt: 4,
            marginLeft: 2,
        }}>
            <Button variant="contained" onClick={() => router.back()} >
                На главную
            </Button>

            <Container maxWidth="md"
                       sx={{
                           flex: 1, // Занимает всю доступную ширину, но делится с другим Box
                           border: "1px solid #c8d3e1", // Цвет границы
                           padding: 3,
                           borderRadius: 2,
                           typography: "body1",
                           boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)",
                           mb: '4rem'
                       }}
            >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Image src="/logo.png" alt="Logo" width={200} height={110} />
                </Box>

                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        color: '#333'
                    }}
                >
                    Заполните форму
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box display="flex" flexDirection="column" gap={2}>

                        {/* Кого ищете */}
                        <FormControl fullWidth>
                            <InputLabel>Кого ищете?</InputLabel>
                            <Controller
                                name="lookingFor"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field}>
                                        <MenuItem value="Дедушку">Дедушку</MenuItem>
                                        <MenuItem value="Бабушку">Бабушку</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                        {errors.lookingFor && <Typography color="error">{errors.lookingFor.message}</Typography>}

                        {/* Вернулся с войны */}
                        <FormControl fullWidth>
                            <InputLabel>Вернулся ли с войны?</InputLabel>
                            <Controller
                                name="returnedFromWar"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field}>
                                        <MenuItem value="Вернулся">Вернулся</MenuItem>
                                        <MenuItem value="Не вернулся">Не вернулся</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>

                        {/* ФИО */}
                        <TextField label="Фамилия" {...register("lastName")} fullWidth />
                        <TextField label="Имя" {...register("firstName")} fullWidth />
                        <TextField label="Отчество" {...register("middleName")} fullWidth />

                        {/* Дата рождения */}
                        <TextField
                            label="Дата рождения"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            {...register("birthDate")}
                            fullWidth
                            inputProps={{
                                min: "1850-01-01",
                                max: "1950-12-31"
                            }}
                            helperText="Выберите дату в период 1850-1950 гг."
                        />

                        {/* Место рождения */}
                        <TextField label="Страна и область" {...register("birthPlaceCountryRegion")} fullWidth />
                        <TextField label="Город, район, населенный пункт" {...register("birthPlaceCity")} fullWidth />

                        {/* Дата призыва */}
                        <TextField
                            label="Дата призыва"
                            type="month"
                            InputLabelProps={{ shrink: true }}
                            {...register("conscriptionDate")}
                            fullWidth
                            inputProps={{
                                min: "1930-01",
                                max: "1950-12"
                            }}
                            helperText="Выберите дату в период 1930-1950 гг."
                        />

                        {/* Семейный статус */}
                        <FormControl fullWidth>
                            <InputLabel>Семейный статус</InputLabel>
                            <Controller
                                name="maritalStatus"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field}>
                                        <MenuItem value="married">Женат / Замужем</MenuItem>
                                        <MenuItem value="divorced">Разведен(-а)</MenuItem>
                                        <MenuItem value="neverMarried">Никогда не состоял(-а) в браке</MenuItem>
                                        <MenuItem value="widowWidower">Вдова / Вдовец</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>

                        {/* Количество детей */}
                        <TextField label="Количество детей и их имена" {...register("childrenNames")} fullWidth />

                        {/* Бывший в плену */}
                        <FormControlLabel control={<Checkbox {...register("prisoner")} />} label="Был ли в плену?" />
                        {watch("prisoner") && <TextField label="Где был пленен?" {...register("prisonerInfo")} fullWidth />}

                        {/* Контактная информация */}
                        <TextField label="ФИО заявителя" {...register("searcherFullName")} fullWidth />
                        <TextField label="Номер телефона" {...register("phoneNumber")} fullWidth />
                        <TextField label="Домашний адрес" {...register("homeAddress")} fullWidth />
                        <TextField label="Электронная почта" {...register("email")} fullWidth />

                        {/* Откуда узнали о нас */}
                        <FormControl fullWidth>
                            <InputLabel>Откуда узнали о нас?</InputLabel>
                            <Controller
                                name="heardAboutUs"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field}>
                                        <MenuItem value="Instagram">Instagram</MenuItem>
                                        <MenuItem value="Facebook">Facebook</MenuItem>
                                        <MenuItem value="TikTok">TikTok</MenuItem>
                                        <MenuItem value="friends">От знакомых</MenuItem>
                                        <MenuItem value="internetSearch">Поиск в интернете</MenuItem>
                                        <MenuItem value="other">Другое</MenuItem>
                                    </Select>
                                )}
                            />
                        </FormControl>
                        {watch("heardAboutUs") === "other" && <TextField label="Укажите источник" {...register("heardAboutUsOther")} fullWidth />}

                        {/* Кнопка отправки */}
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? "Отправка..." : "Отправить"}
                        </Button>
                    </Box>
                </form>
            </Container>
        </Box>

    );
}
