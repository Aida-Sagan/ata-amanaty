"use client";

import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, Divider, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";

interface Statistic {
    _id: string;
    total: number;
    found: number;
}

export default function StatisticsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [regionStats, setRegionStats] = useState<Statistic[]>([]);
    const [countryStats, setCountryStats] = useState<Statistic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!open) {
            // когда модалка закрывается — очищаем
            setRegionStats([]);
            setCountryStats([]);
            setLoading(true);
            return;
        }

        const fetchStatistics = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/statistics");
                setRegionStats(res.data.data.regions);
                setCountryStats(res.data.data.countries);
            } catch (err) {
                console.error("Ошибка загрузки статистики:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [open]);


    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 900,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowX: "auto",
                    overflowY: "auto"
                }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Статистика заявок
                </Typography>

                <Divider sx={{ mb: 2 }}>По областям</Divider>
                {loading ? (
                    <Typography>Загрузка...</Typography>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={regionStats}>
                            <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#1976d2" name="Всего заявок" />
                            <Bar dataKey="found" fill="#4caf50" name="Найдено" />
                        </BarChart>
                    </ResponsiveContainer>
                )}

                <Divider sx={{ my: 2 }}>По странам подачи</Divider>
                {loading ? (
                    <Typography>Загрузка...</Typography>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Страна</TableCell>
                                <TableCell>Всего заявок</TableCell>
                                <TableCell>Найдено</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {countryStats.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>{item._id || "Не указано"}</TableCell>
                                    <TableCell>{item.total}</TableCell>
                                    <TableCell>{item.found}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                <Button variant="contained" sx={{ mt: 3 }} onClick={onClose}>Закрыть</Button>
            </Box>
        </Modal>
    );
}
