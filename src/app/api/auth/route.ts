import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Предопределённые администраторы (логин и пароль в открытом виде)
const admins = [
    { username: "admin1", password: "admin123" },
    { username: "admin2", password: "admin456" },
    { username: "admin3", password: "admin789" },
    { username: "admin4", password: "admin999" },
    { username: "admin5", password: "admin555" },
    { username: "admin6", password: "admin777" },
];

// Получаем секретный ключ из переменных окружения
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"; // Если переменная не задана, используем "mysecretkey"

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        console.log("Логин:", username);
        console.log("Пароль:", password);

        // Ищем администратора по логину и паролю
        const admin = admins.find((user) => user.username === username && user.password === password);
        if (!admin) {
            console.log("❌ Неверные учетные данные!");
            return NextResponse.json({ success: false, message: "Неверные учетные данные" }, { status: 401 });
        }

        console.log("✅ Успешный вход:", admin.username);

        // Генерируем JWT-токен
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "2h" });

        console.log("🎟️ Токен создан:", token);

        return NextResponse.json({ success: true, token });
    } catch (error) {
        console.error("Ошибка авторизации:", error);
        return NextResponse.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
    }
}
