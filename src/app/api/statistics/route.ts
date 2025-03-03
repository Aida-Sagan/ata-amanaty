import { NextResponse } from "next/server";
import connectDB from "@/server/db"; // Подключение к базе данных
import Request from "@/server/models/Request"; // Модель заявки

export async function GET() {
    try {
        await connectDB(); // Убеждаемся, что подключение к MongoDB установлено

        // Получаем общее количество поданных заявок
        const totalApplications = await Request.countDocuments();

        // Получаем количество найденных людей (например, статус "Найден")
        const foundPeople = await Request.countDocuments({ status: "Найдена" });

        return NextResponse.json({
            submittedToday: totalApplications,
            foundToday: foundPeople,
        });
    } catch (error) {
        console.error("Ошибка получения статистики:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}
