"use client";

import { useState, useEffect, useCallback } from "react";
import { Container, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import CircularWithValueLabel from "@/components/CircularWithValueLabel";
import { IconDatabaseEdit, IconLogout } from '@tabler/icons-react';
import { jwtDecode } from "jwt-decode";
import StatisticsModal from "@/components/StatisticsModal";
import { usePagination } from "@/lib/PaginationContext";

interface Request {
    _id: string;
    lookingFor: string;
    returnedFromWar: string;
    lastName: string;
    firstName: string;
    searcherFullName: string;
    phoneNumber: string;
    email: string;
    applicationRegion: string;
    status: string;
    createdAt: string;
}

interface DecodedToken {
    username: string;
}

export default function AdminPageContent() {
    const [auth, setAuth] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>([]);
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [openStatistics, setOpenStatistics] = useState(false);

    const { currentPage, setCurrentPage } = usePagination();
    const itemsPerPage = 10;

    const fetchRequests = useCallback(async () => {
        try {
            const response = await axios.get("/api/requests");
            setRequests(response.data.data);
        } catch (error) {
            console.error("Ошибка при загрузке заявок:", error);
        }
    }, []);

    useEffect(() => {
        const authenticate = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/admin/login");
                return;
            }
            console.log(auth)
            try {
                const decoded: DecodedToken = jwtDecode(token);
                if (!decoded.username) {
                    console.error("Недействительный токен");
                    return;
                }
                setAuth(true);
            } catch (error) {
                console.error("Ошибка при декодировании токена:", error);
                localStorage.removeItem("token");
                router.push("/admin/login");
            } finally {
                setAuthLoading(false);
            }
        };

        authenticate().then(fetchRequests).catch(console.error);
    }, [router, fetchRequests]);

    const statusColors: Record<string, string> = {
        "В обработке": "#FFF9C4",
        "В процессе": "#BBDEFB",
        "Найдена": "#C8E6C9",
        "Отклонена": "#FFCDD2",
    };

    const handleSortByDate = () => {
        setSortAsc(!sortAsc);
        setRequests([...requests].sort((a, b) => {
            return sortAsc
                ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }));
    };

    const filteredRequests = requests.filter((req) =>
        req.lastName.toLowerCase().includes(search.toLowerCase()) ||
        req.firstName.toLowerCase().includes(search.toLowerCase()) ||
        req.phoneNumber.includes(search)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/admin/login");
    };

    return (
        <Container sx={{ mb: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    <IconDatabaseEdit stroke={2} size={35} /> Личный кабинет администратора
                </Typography>
                <Button variant="contained" color="error" startIcon={<IconLogout />} onClick={handleLogout}>
                    Выйти
                </Button>
            </Box>

            <TextField
                fullWidth
                placeholder="Поиск по заявкам"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}
                sx={{ marginBottom: "20px" }}
            />
            <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpenStatistics(true)}>
                Посмотреть статистику по областям и странам
            </Button>

            {authLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                    <CircularWithValueLabel />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }}>№</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }}>Номер заявки</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }}>Фамилия</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }}>Имя</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }}>ФИО заявителя</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }}>Регион подачи заявки</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }}>Номер тел.</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }}>Статус</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", fontSize: "12px", textAlign: "center" }}>
                                        <Button onClick={handleSortByDate} sx={{ fontWeight: "bold", fontSize: "12px" }}>
                                            Дата поступления заявки {sortAsc ? "▲" : "▼"}
                                        </Button>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Действие</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((req, index) => (
                                        <TableRow key={req._id}>
                                            <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                                            <TableCell sx={{ fontSize: "10px" }}>{req._id}</TableCell>
                                            <TableCell sx={{ fontSize: "10px" }}>{req.lastName}</TableCell>
                                            <TableCell sx={{ fontSize: "10px" }}>{req.firstName}</TableCell>
                                            <TableCell sx={{ fontSize: "10px" }}>{req.searcherFullName}</TableCell>
                                            <TableCell sx={{ fontSize: "10px" }}>{req.applicationRegion}</TableCell>
                                            <TableCell sx={{ fontSize: "10px" }}>{req.phoneNumber}</TableCell>
                                            <TableCell
                                                sx={{
                                                    fontSize: "10px",
                                                    backgroundColor: statusColors[req.status],
                                                    color: "#000",
                                                    borderRadius: "4px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {req.status}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: "10px", textAlign: "center" }}>
                                                {new Date(req.createdAt).toLocaleDateString("ru-RU", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}


                                            </TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" onClick={() => router.push(`/admin/${req._id}`)}>
                                                    заявка
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} align="center">
                                            Нет данных
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        color="primary"
                        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    />
                </>
            )}

            <StatisticsModal open={openStatistics} onClose={() => setOpenStatistics(false)} />
        </Container>
    );
}
