"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Checkbox,
    FormControlLabel, Divider,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { SelectChangeEvent } from "@mui/material";
import { useLanguage } from "@/lib/LanguageContext";

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
    applicationRegion?: string;
    applicationCountry?: string;
    searchGoal?: string;
    archiveSearch?: string;
    archiveDetails?: string;
    additionalInfo?: string;
    files?: string[];
    prisoner: boolean;
    prisonerInfo?: string;
    searcherFullName: string;
    phoneNumber: string;
    homeAddress?: string;
    email: string;
    heardAboutUs: string;
    heardAboutUsOther?: string;
    filesLink?: string;
}

export default function VerifyPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const fetchData = useCallback(async () => {
        const requestId = localStorage.getItem("requestId");
        if (!requestId) {
            router.push("/form");
            return;
        }

        try {
            const response = await axios.get(`/api/requests?id=${requestId}`);
            setRequestData(response.data.data);
            console.log("filesLink из бэка:", response.data.data.filesLink);


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
        if (!requestData) return;
        setRequestData({ ...requestData, [event.target.name]: event.target.value });
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        if (!requestData) return;
        setRequestData({ ...requestData, [event.target.name]: event.target.value });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!requestData) return;
        setRequestData({ ...requestData, [event.target.name]: event.target.checked });
    };

    const handleUpdate = async () => {
        if (!requestData?._id) {
            alert("Ошибка: ID заявки отсутствует.");
            return;
        }

        setLoading(true);
        try {
            await axios.put(`/api/requests`, {
                id: requestData._id,
                ...requestData,
            });

            router.push("/success-page");
        } catch (error) {
            console.error("Ошибка обновления:", error);
            alert("Ошибка при обновлении заявки.");
        } finally {
            setLoading(false);
        }
    };

    if (!requestData || isLoadingData) {
        return <Typography align="center">{t("loading")}</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ flex: 1, border: "1px solid #c8d3e1", padding: 3, borderRadius: 2, typography: "body1", boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.2)", mb: "4rem", mt: "2rem" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Image src="/logo.png" alt="Logo" width={200} height={110} />
            </Box>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#756308" }}>
                {t("verifyTitle")}
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField label={t("lookingFor")} name="lookingFor" value={requestData.lookingFor || ""} onChange={handleChange} fullWidth />
                <TextField label={t("returnedFromWar")} name="returnedFromWar" value={requestData.returnedFromWar || ""} onChange={handleChange} fullWidth />

                <Divider textAlign="left">{t("personData")}</Divider>

                <TextField label={t("lastName")} name="lastName" value={requestData.lastName} onChange={handleChange} fullWidth />
                <TextField label={t("firstName")} name="firstName" value={requestData.firstName} onChange={handleChange} fullWidth />
                <TextField label={t("middleName")} name="middleName" value={requestData.middleName || ""} onChange={handleChange} fullWidth />
                <TextField label={t("birthDate")} name="birthDate" value={requestData.birthDate} onChange={handleChange} fullWidth />
                <TextField label={t("birthCountry")} name="birthCountry" value={requestData.birthCountry || ""} onChange={handleChange} fullWidth />
                <TextField label={t("birthRegion")} name="birthRegion" value={requestData.birthRegion || ""} onChange={handleChange} fullWidth />
                <TextField label={t("birthPlaceCity")} name="birthPlaceCity" value={requestData.birthPlaceCity} onChange={handleChange} fullWidth />
                <TextField label={t("conscriptionDate")} name="conscriptionDate" value={requestData.conscriptionDate || ""} onChange={handleChange} fullWidth />
                <TextField label={t("conscriptionPlace")} name="conscriptionPlace" value={requestData.conscriptionPlace || ""} onChange={handleChange} fullWidth />

                <Divider textAlign="left">{t("additionalInfoTitle")}</Divider>

                <FormControl fullWidth>
                    <InputLabel>{t("maritalStatus")}</InputLabel>
                    <Select name="maritalStatus" value={requestData.maritalStatus || ""} onChange={handleSelectChange}>
                        <MenuItem value="married">{t("married")}</MenuItem>
                        <MenuItem value="divorced">{t("divorced")}</MenuItem>
                        <MenuItem value="neverMarried">{t("single")}</MenuItem>
                        <MenuItem value="widowWidower">{t("widow")}</MenuItem>
                    </Select>
                </FormControl>

                <TextField label={t("childrenNames")} name="childrenNames" value={requestData.childrenNames || ""} onChange={handleChange} fullWidth />
                <TextField label={t("relativesListed")} name="relativesListed" value={requestData.relativesListed || ""} onChange={handleChange} fullWidth />
                <TextField label={t("applicationRegion")} name="applicationRegion" value={requestData.applicationRegion || ""} onChange={handleChange} fullWidth />
                <TextField label={t("applicationCountry")} name="applicationCountry" value={requestData.applicationCountry || ""} onChange={handleChange} fullWidth />

                <FormControlLabel control={<Checkbox name="prisoner" checked={requestData.prisoner} onChange={handleCheckboxChange} />} label={t("prisoner")} />
                {requestData.prisoner && (
                    <TextField label={t("prisonerInfo")} name="prisonerInfo" value={requestData.prisonerInfo || ""} onChange={handleChange} fullWidth />
                )}

                <Divider textAlign="left">{t("contactData")}</Divider>

                <TextField label={t("searcherFullName")} name="searcherFullName" value={requestData.searcherFullName} onChange={handleChange} fullWidth />
                <TextField label={t("phoneNumber")} name="phoneNumber" value={requestData.phoneNumber} onChange={handleChange} fullWidth />
                <TextField label={t("homeAddress")} name="homeAddress" value={requestData.homeAddress || ""} onChange={handleChange} fullWidth />
                <TextField label={t("email")} name="email" value={requestData.email} onChange={handleChange} fullWidth />

                <Divider textAlign="left">{t("searchGoalTitle")}</Divider>

                <TextField label={t("searchGoal")} name="searchGoal" value={requestData.searchGoal || ""} onChange={handleChange} fullWidth />

                <TextField
                    label="Ссылка на файлы"
                    fullWidth
                    margin="normal"
                    name="filesLink"
                    value={requestData.filesLink || ""} onChange={handleChange}
                />

                <TextField label={t("archiveSearch")} name="archiveSearch" value={requestData.archiveSearch || ""} onChange={handleChange} fullWidth />
                <TextField label={t("archiveDetails")} name="archiveDetails" value={requestData.archiveDetails || ""} onChange={handleChange} fullWidth multiline rows={3} />
                <TextField label={t("additionalInfo")} name="additionalInfo" value={requestData.additionalInfo || ""} onChange={handleChange} fullWidth multiline rows={3} />

                <Divider textAlign="left">{t("infoSourceTitle")}</Divider>

                <FormControl fullWidth>
                    <InputLabel>{t("heardAboutUs")}</InputLabel>
                    <Select name="heardAboutUs" value={requestData.heardAboutUs} onChange={handleSelectChange}>
                        <MenuItem value="Instagram">{t("instagram")}</MenuItem>
                        <MenuItem value="Facebook">{t("facebook")}</MenuItem>
                        <MenuItem value="TikTok">{t("tiktok")}</MenuItem>
                        <MenuItem value="friends">{t("friends")}</MenuItem>
                        <MenuItem value="internetSearch">{t("internetSearch")}</MenuItem>
                        <MenuItem value="other">{t("otherVariant")}</MenuItem>
                    </Select>
                </FormControl>
                {requestData.heardAboutUs === "other" && (
                    <TextField label={t("heardAboutUsOther")} name="heardAboutUsOther" value={requestData.heardAboutUsOther || ""} onChange={handleChange} fullWidth />
                )}

                <Button variant="contained" color="primary" onClick={handleUpdate} disabled={loading}>
                    {loading ? t("saving") : t("confirm")}
                </Button>
            </Box>
        </Container>
    );
}