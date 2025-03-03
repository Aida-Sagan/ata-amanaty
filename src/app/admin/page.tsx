"use client";

import { useState, useEffect, useCallback } from "react";
import { Container, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Pagination } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import CircularWithValueLabel from "@/components/CircularWithValueLabel";
import { IconDatabaseEdit, IconLogout } from '@tabler/icons-react';
import { jwtDecode } from "jwt-decode";


interface Request {
    _id: string;
    lookingFor: string;
    returnedFromWar: string;
    lastName: string;
    firstName: string;
    searcherFullName: string;
    phoneNumber: string;
    email: string;
    status: string;
    createdAt: string;
}

interface DecodedToken {
    username: string;
}


export default function AdminPage() {
    const [auth, setAuth] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();
    const [requests, setRequests] =  useState<Request[]>([]);
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
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
            console.log(auth);

            if (!token) {
                router.push("/admin/login");
                return;
            }

            try {
                const decoded: DecodedToken = jwtDecode(token);
                if (!decoded.username) throw new Error("Недействительный токен");
                setAuth(true);
            } catch (error) {
                console.error("Ошибка при декодировании токена:", error);
                localStorage.removeItem("token");
                router.push("/admin/login");
            } finally {
                setAuthLoading(false);
            }
        };

        authenticate().then(fetchRequests).catch(console.error); // ✅ Обрабатываем ошибки

    }, [router, fetchRequests]); // ✅ Добавили `fetchRequests` в зависимости


    const statusColors: Record<string, string> = {
        "В обработке": "bg-yellow-lt",
        "В процессе": "bg-blue-lt",
        "Найдена": "bg-green-lt",
        "Отклонена": "bg-red-lt",
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
        <Container sx={{ mb: 2 }}>
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
                                    <TableCell sx={{ fontWeight: 'bold' }}>№</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Номер заявки</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Кого ищут</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Вернулся ли с войны</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Фамилия</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Имя</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ФИО заявителя</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Номер тел.</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>эл.почта</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        <Button onClick={handleSortByDate}>
                                            Дата поступления заявки {sortAsc ? "▲" : "▼"}
                                        </Button>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Действие</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((req, index) => (
                                        <TableRow key={req._id}>
                                            <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                                            <TableCell>{req._id}</TableCell>
                                            <TableCell>{req.lookingFor}</TableCell>
                                            <TableCell>{req.returnedFromWar}</TableCell>
                                            <TableCell>{req.lastName}</TableCell>
                                            <TableCell>{req.firstName}</TableCell>
                                            <TableCell>{req.searcherFullName}</TableCell>
                                            <TableCell>{req.phoneNumber}</TableCell>
                                            <TableCell>{req.email}</TableCell>
                                            <TableCell className={`badge ${statusColors[req.status]}`} sx={{display: 'flex', alignContent:'center'}}>
                                                {req.status}
                                            </TableCell>
                                            <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" onClick={() => router.push(`/admin/${req._id}`)}>
                                                    Подробнее
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} align="center">Нет данных</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Пагинация */}
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        color="primary"
                        sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    />
                </>
            )}
        </Container>
    );
}
