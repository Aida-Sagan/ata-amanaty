import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
    process.env.NODE_ENV === "development"
        ? process.env.MONGODB_URI_LOCAL
        : process.env.MONGODB_URI_ATLAS;

if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI не задана! Добавь её в .env или Vercel.");
}

const connectDB = async (): Promise<void> => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(MONGODB_URI, {});
        console.log("✅ Подключено к MongoDB:", process.env.NODE_ENV);
    } catch (error) {
        console.error("❌ Ошибка подключения к MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
