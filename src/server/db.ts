import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Подключено к MongoDB");
    } catch (error) {
        console.error("❌ Ошибка подключения к MongoDB:", error);
    }

};

export default connectDB;
