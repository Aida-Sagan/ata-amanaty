    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { useForm, Controller } from "react-hook-form";
    import {
        TextField,
        Button,
        MenuItem,
        FormControl,
        InputLabel,
        Select,
        Checkbox,
        FormControlLabel,
        Typography,
        Container,
        Box,
        Divider,
    } from "@mui/material";
    import { yupResolver } from "@hookform/resolvers/yup";
    import * as yup from "yup";
    import axios from "axios";
    import Image from "next/image";
    import { useLanguage } from "@/lib/LanguageContext";
    import countries from "@/lib/data/countries-ru.json";



    // Типизация
    interface FormDataType {
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
        applicationRegion: string;
        applicationCountry?: string;
        searchGoal?: string;
        archiveSearch?: string;
        archiveDetails?: string;
        additionalInfo?: string;
        prisoner: boolean;
        prisonerInfo?: string;
        searcherFullName: string;
        phoneNumber: string;
        homeAddress?: string;
        email: string;
        heardAboutUs: string;
        heardAboutUsOther?: string;
    }

    const schema = yup.object().shape({
        lookingFor: yup.string().optional(),
        returnedFromWar: yup.string().optional(),
        lastName: yup.string().required("Фамилия обязательна"),
        firstName: yup.string().required("Имя обязательно"),
        middleName: yup.string().optional(),
        birthDate: yup.string().required("Дата рождения обязательна"),
        birthCountry: yup.string().optional(),
        birthRegion: yup.string().optional(),
        birthPlaceCity: yup.string().required("Укажите место рождения (город, район)"),
        conscriptionDate: yup.string().optional(),
        conscriptionPlace: yup.string().optional(),
        maritalStatus: yup.string().optional(),
        childrenNames: yup.string().optional(),
        relativesListed: yup.string().optional(),
        applicationRegion: yup.string().required("Выберите область"),
        applicationCountry: yup.string().optional(),
        searchGoal: yup.string().optional(),
        archiveSearch: yup.string().optional(),
        archiveDetails: yup.string().optional(),
        additionalInfo: yup.string().optional(),
        prisoner: yup.boolean().default(false),
        prisonerInfo: yup.string().optional(),
        searcherFullName: yup.string().required("ФИО обязательно"),
        phoneNumber: yup.string().required("Номер телефона обязателен"),
        homeAddress: yup.string().optional(),
        email: yup.string().email("Введите корректный email").required("Email обязателен"),
        heardAboutUs: yup.string().required("Выберите источник"),
        heardAboutUsOther: yup.string().optional(),

    });

    export const regions = [
        "Абайская область",
        "Актюбинская область",
        "Алматинская область",
        "Атырауская область",
        "Восточно-Казахстанская область",
        "Жамбылская область",
        "Жетысуская область",
        "Западно-Казахстанская область",
        "Карагандинская область",
        "Костанайская область",
        "Кызылординская область",
        "Мангистауская область",
        "Павлодарская область",
        "Северо-Казахстанская область",
        "Туркестанская область",
        "Улытауская область",
        "Шымкент (город республиканского значения)",
        "Астана (город республиканского значения)",
        "Алматы (город республиканского значения)",
        "Я не из Казахстана"
    ];


    export default function FormPage() {
        const router = useRouter();
        const [loading, setLoading] = useState(false);
        const { t } = useLanguage();

        const {
            control,
            handleSubmit,
            register,
            watch,
            formState: { errors },
        } = useForm<FormDataType>({
            resolver: yupResolver(schema),
            defaultValues: {
                lookingFor: "",
                returnedFromWar: "",
                lastName: "",
                firstName: "",
                middleName: "",
                birthDate: "",
                birthCountry: "",
                birthRegion: "",
                birthPlaceCity: "",
                conscriptionDate: "",
                conscriptionPlace: "",
                maritalStatus: "",
                childrenNames: "",
                relativesListed: "",
                applicationRegion: "",
                applicationCountry: "",
                searchGoal: "",
                archiveSearch: "",
                archiveDetails: "",
                additionalInfo: "",
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
                const requestId = response.data.data._id;
                localStorage.setItem("requestId", requestId);
                router.push("/verify");
            } catch (error) {
                console.error("Ошибка отправки:", error);
                alert("Ошибка отправки заявки.");
            } finally {
                setLoading(false);
            }
        };

        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4, p: 3, border: "1px solid #c8d3e1", borderRadius: 2, boxShadow: 3, position: "relative" }}>
                <Button
                    variant="contained"
                    onClick={() => router.back()}
                    sx={{ position: "absolute", top: 16, left: 16 }}
                >
                    {t("back")}
                </Button>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Image src="/logo.png" alt="Logo" width={200} height={110} />
                </Box>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "Playfair Display, serif", fontWeight: "bold", color: "#333" }}>
                    {t("formTitle")}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: "70vh", overflowY: "auto", pr: 1 }}>

                    <FormControl fullWidth>
                        <InputLabel>{t("lookingFor")}</InputLabel>
                        <Controller
                            name="lookingFor"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label={t("lookingFor")}>
                                    <MenuItem value="Дедушку">{t("grandfather")}</MenuItem>
                                    <MenuItem value="Бабушку">{t("grandmother")}</MenuItem>
                                    <MenuItem value="Родственника">{t("relative")}</MenuItem>
                                    <MenuItem value="Другое">{t("otherPerson")}</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>{t("returnedFromWar")}</InputLabel>
                        <Controller
                            name="returnedFromWar"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label={t("returnedFromWar")}>
                                    <MenuItem value="Вернулся">{t("returned")}</MenuItem>
                                    <MenuItem value="Не вернулся">{t("notReturned")}</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>

                    <Divider textAlign="left">{t("personData")}</Divider>

                    <TextField label={t("lastName")} {...register("lastName")} helperText={errors.lastName?.message} error={!!errors.lastName} fullWidth />
                    <TextField label={t("firstName")} {...register("firstName")} helperText={errors.firstName?.message} error={!!errors.firstName} fullWidth />
                    <TextField label={t("middleName")} {...register("middleName")} fullWidth />
                    <TextField label={t("birthDate")} {...register("birthDate")} helperText={errors.birthDate?.message} error={!!errors.birthDate} fullWidth />
                    <TextField label={t("birthCountry")} {...register("birthCountry")} fullWidth />
                    <TextField label={t("birthRegion")} {...register("birthRegion")} fullWidth />
                    <TextField label={t("birthPlaceCity")} {...register("birthPlaceCity")} helperText={errors.birthPlaceCity?.message} fullWidth />
                    <TextField label={t("conscriptionDate")} {...register("conscriptionDate")} fullWidth />
                    <TextField label={t("conscriptionPlace")} {...register("conscriptionPlace")} fullWidth />

                    <Divider textAlign="left">{t("additionalInfoTitle")}</Divider>

                    <FormControl fullWidth>
                        <InputLabel>{t("maritalStatus")}</InputLabel>
                        <Controller
                            name="maritalStatus"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label={t("maritalStatus")}>
                                    <MenuItem value="Женат / Замужем">{t("married")}</MenuItem>
                                    <MenuItem value="Разведен(-а)">{t("divorced")}</MenuItem>
                                    <MenuItem value="Никогда не состоял(-а) в браке">{t("single")}</MenuItem>
                                    <MenuItem value="Вдова / Вдовец">{t("widow")}</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>

                    <TextField label={t("relativesListed")} {...register("relativesListed")} fullWidth />
                    <TextField label={t("childrenNames")} {...register("childrenNames")} fullWidth />
                    <FormControlLabel control={<Checkbox {...register("prisoner")} />} label={t("prisoner")} />
                    {watch("prisoner") && (
                        <TextField label={t("prisonerInfo")} {...register("prisonerInfo")} fullWidth />
                    )}

                    <Divider textAlign="left">{t("contactData")}</Divider>

                    <TextField label={t("searcherFullName")} {...register("searcherFullName")} helperText={errors.searcherFullName?.message} error={!!errors.searcherFullName} fullWidth />
                    <TextField label={t("phoneNumber")} {...register("phoneNumber")} helperText={errors.phoneNumber?.message} error={!!errors.phoneNumber} fullWidth />
                    <TextField label={t("homeAddress")} {...register("homeAddress")} fullWidth />
                    <FormControl fullWidth error={!!errors.applicationRegion}>
                        <InputLabel>{t("applicationRegion")}</InputLabel>
                        <Controller
                            name="applicationRegion"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label={t("applicationRegion")}>
                                    {regions.map((region) => (
                                        <MenuItem key={region} value={region}>
                                            {region}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.applicationRegion && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                {errors.applicationRegion.message}
                            </Typography>
                        )}
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>{t("applicationCountry")}</InputLabel>
                        <Controller
                            name="applicationCountry"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label={t("applicationCountry")}>
                                    {countries.map((country) => (
                                        <MenuItem key={country} value={country}>
                                            {country}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>

                    <TextField label={t("email")} {...register("email")} helperText={errors.email?.message} error={!!errors.email} fullWidth />

                    <Divider textAlign="left">{t("searchGoalTitle")}</Divider>

                    <FormControl fullWidth>
                        <InputLabel>{t("searchGoal")}</InputLabel>
                        <Controller
                            name="searchGoal"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label={t("searchGoal")}>
                                    <MenuItem value="Определение места захоронения">{t("determineGrave")}</MenuItem>
                                    <MenuItem value="Уточнение места захоронения">{t("clarifyGrave")}</MenuItem>
                                    <MenuItem value="Определить судьбу солдата">{t("determineFate")}</MenuItem>
                                    <MenuItem value="Определить боевой путь">{t("determinePath")}</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>

                    <TextField label={t("archiveSearch")} {...register("archiveSearch")} fullWidth />
                    <TextField label={t("archiveDetails")} {...register("archiveDetails")} fullWidth multiline rows={3} />
                    <TextField label={t("additionalInfo")} {...register("additionalInfo")} fullWidth multiline rows={3} />

                    <Divider textAlign="left">{t("infoSourceTitle")}</Divider>

                    <FormControl fullWidth error={!!errors.heardAboutUs}>
                        <InputLabel>{t("heardAboutUs")}</InputLabel>
                        <Controller
                            name="heardAboutUs"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label={t("heardAboutUs")}>
                                    <MenuItem value="Instagram">{t("instagram")}</MenuItem>
                                    <MenuItem value="Facebook">{t("facebook")}</MenuItem>
                                    <MenuItem value="TikTok">{t("tiktok")}</MenuItem>
                                    <MenuItem value="friends">{t("friends")}</MenuItem>
                                    <MenuItem value="internetSearch">{t("internetSearch")}</MenuItem>
                                    <MenuItem value="other">{t("otherVariant")}</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.heardAboutUs && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                {errors.heardAboutUs.message}
                            </Typography>
                        )}
                    </FormControl>

                    {watch("heardAboutUs") === "other" && (
                        <TextField label={t("heardAboutUsOther")} {...register("heardAboutUsOther")} fullWidth />
                    )}
                    <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
                            {loading ? t("sending") : t("submitApplication")}
                    </Button>
                </Box>
            </Container>

        );
    }
