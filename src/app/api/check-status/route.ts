import { NextResponse } from "next/server";
import connectDB from "@/server/db";
import Request from "@/server/models/Request";

export async function POST(req: Request) {
    await connectDB();

    try {
        const body = await req.json();
        const { requestNumber } = body; // Получаем номер заявки

        if (!requestNumber) {
            return NextResponse.json({ success: false, message: "Введите номер заявки" }, { status: 400 });
        }

        // Ищем заявку по ID
        const request = await Request.findById(requestNumber);

        if (!request) {
            return NextResponse.json({ success: false, message: "Заявка не найдена" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: request });
    } catch (error) {
        console.error("Ошибка при получении статуса заявки:", error);
        return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
    }
}
