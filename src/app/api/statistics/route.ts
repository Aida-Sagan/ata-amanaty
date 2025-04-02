import { NextResponse } from "next/server";
import connectDB from "@/server/db";
import Request from "@/server/models/Request";

export async function GET() {
    try {
        await connectDB();

        // Подсчёт заявок по регионам + сколько найдено в каждом регионе
        const regionStats = await Request.aggregate([
            {
                $group: {
                    _id: "$applicationRegion",
                    total: { $sum: 1 },
                    found: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Найдена"] }, 1, 0],
                        },
                    },
                },
            },
            { $sort: { total: -1 } },
        ]);

        // Подсчёт заявок по странам + сколько найдено в каждой стране
        const countryStats = await Request.aggregate([
            {
                $group: {
                    _id: "$applicationCountry",
                    total: { $sum: 1 },
                    found: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Найдена"] }, 1, 0],
                        },
                    },
                },
            },
            { $sort: { total: -1 } },
        ]);

        const totalApplications = await Request.countDocuments();
        const foundPeople = await Request.countDocuments({ status: "Найдена" });

        return NextResponse.json({
            success: true,
            data: {
                totalApplications,
                foundPeople,
                regions: regionStats,
                countries: countryStats,
            },
        });
    } catch (error) {
        console.error("Ошибка получения статистики:", error);
        return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
    }
}
