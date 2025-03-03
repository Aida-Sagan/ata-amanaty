import mongoose from "mongoose";

// Определяем возможные статусы заявки
const STATUS_ENUM = ["В обработке", "В процессе", "Найдена", "Отклонена"] as const;
type StatusType = (typeof STATUS_ENUM)[number];

const RequestSchema = new mongoose.Schema({
    lookingFor: String,
    returnedFromWar: String,
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: String,
    birthDate: { type: String, required: true },
    birthPlaceCountryRegion: { type: String, required: true },
    birthPlaceCity: { type: String, required: true },
    conscriptionDate: String,
    maritalStatus: String,
    childrenNames: String,
    relativesListed: String,
    prisoner: Boolean,
    prisonerInfo: String,
    searcherFullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    homeAddress: String,
    email: { type: String, required: true },
    heardAboutUs: String,
    heardAboutUsOther: String,

    // Добавляем поле для хранения ссылок на загруженные файлы
    // attachments: [{ type: String }], // массив строк (URL файлов)

    // 🟢 СТАТУС ЗАЯВКИ (Меняется только в админке, не в форме)
    status: { type: String, enum: STATUS_ENUM, default: "В обработке" },

    createdAt: { type: Date, default: Date.now },
});

// Экспортируем модель
export default mongoose.models.Request || mongoose.model("Request", RequestSchema);
