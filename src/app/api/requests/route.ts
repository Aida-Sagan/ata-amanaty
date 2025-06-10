import { NextResponse } from "next/server";
import connectDB from "@/server/db";
import Request from "@/server/models/Request";

export async function GET(req: Request) {
    try {
        await connectDB(); // Убедись, что база подключена
        const { searchParams } = new URL(req.url);
        const requestId = searchParams.get("id");

        if (requestId) {
            // Если передан ID, ищем конкретную заявку
            const request = await Request.findById(requestId);
            if (!request) {
                return NextResponse.json({ success: false, message: "Заявка не найдена" }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: request });
        }

        // Если ID нет, возвращаем все заявки
        const allRequests = await Request.find({});
        return NextResponse.json({ success: true, data: allRequests });
    } catch (error) {
        console.error("Ошибка в API /api/requests:", error);
        return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    await connectDB();

    try {
        const body = await req.json();
        const { id, status, adminComment, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: "ID заявки не передан" }, { status: 400 });
        }

        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { ...updateData, status, adminComment },
            { new: true }
        );

        if (!updatedRequest) {
            return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedRequest });
    } catch (error) {
        console.error("Ошибка обновления заявки:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}


export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        console.log("Пришли данные:", body); // Добавь это
        const newRequest = new Request({ ...body, adminComment: "" });
        await newRequest.save();
        return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
    } catch (error) {
        console.error("Ошибка при отправке заявки:", error); // Тут будет ошибка
        return NextResponse.json({ success: false, message: "Ошибка при отправке заявки" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const requestId = searchParams.get("id");

        if (!requestId) {
            return NextResponse.json({ success: false, message: "ID заявки не передан" }, { status: 400 });
        }

        const deletedRequest = await Request.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return NextResponse.json({ success: false, message: "Заявка не найдена" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Заявка успешно удалена" });
    } catch (error) {
        console.error("Ошибка при удалении заявки:", error);
        return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
    }
}