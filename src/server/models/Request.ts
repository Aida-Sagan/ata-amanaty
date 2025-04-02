import mongoose from "mongoose";

const STATUS_ENUM = ["В обработке", "В процессе", "Найдена", "Отклонена"] as const;
type StatusType = (typeof STATUS_ENUM)[number];

const RequestSchema = new mongoose.Schema({
    lookingFor: String,
    returnedFromWar: String,
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: String,
    birthDate: { type: String, required: true },
    birthCountry: String,
    birthRegion: String,
    birthPlaceCity: { type: String, required: true },
    conscriptionDate: String,
    conscriptionPlace: String,
    maritalStatus: String,
    childrenNames: String,
    relativesListed: String,
    prisoner: Boolean,
    prisonerInfo: String,
    searcherFullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    homeAddress: String,
    applicationRegion: String,
    applicationCountry: String,
    email: { type: String, required: true },
    searchGoal: String,
    archiveSearch: String,
    archiveDetails: String,
    additionalInfo: String,
    heardAboutUs: String,
    heardAboutUsOther: String,
    status: { type: String as () => StatusType, enum: STATUS_ENUM, default: "В обработке" },
    createdAt: { type: Date, default: Date.now },
    adminComment: { type: String, default: "" },


});

export default mongoose.models.Request || mongoose.model("Request", RequestSchema);
