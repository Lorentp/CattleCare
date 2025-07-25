const mongoose = require("mongoose")

const dailyRecordSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    totalCalves: {
        type:Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
})

const DailyRecordModel = mongoose.model("DailyRecord", dailyRecordSchema)

module.exports = DailyRecordModel