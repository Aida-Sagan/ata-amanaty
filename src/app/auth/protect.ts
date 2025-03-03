import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"; // Должно совпадать с файлом route.ts

export function authenticateToken(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    console.log("Заголовок Authorization:", authHeader);

    if (!authHeader) return null;

    const token = authHeader.split(" ")[1]; // Bearer TOKEN
    console.log("🔑 Извлеченный токен:", token);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("✅ Токен действителен:", decoded);
        return decoded;
    } catch (error) {
        console.error("❌ Ошибка при проверке токена:", error);
        return null;
    }
}
