const CalfModel = require("../models/calf.model")
const DailyRecordModel = require("../models/dailyRecord.model")
const moment = require("moment-timezone")

class DailyRecordManager{
    async calculateTotalCalves(userId){
      try {
        const query = {
          owner: userId,
          isDead: {$in: [false, undefined]},
          isReleased: {$in: [false, undefined]}
        }
    
        const total = await CalfModel.countDocuments(query)
        return total
      } catch (error) {
        console.error("Error calculatinggg total calves:", error)   
    }}

    async registerDailyTotal(userId){
        const today = moment.tz("America/Argentina/Buenos_Aires").startOf("day").toDate()

        try {
            const existingRecord = await DailyRecordModel.findOne({ date: today, owner: userId})
            if(!existingRecord){
                const total = await this.calculateTotalCalves(userId)
                const newRecord = new DailyRecordModel({
                    date: today,
                    totalCalves: total,
                    owner: userId
                })
                await newRecord.save()
                console.log(`Daily record saved for ${userId}: ${total} calves on ${today.toDateString()}`)
            } else{
                console.log(`Record already exists for ${today.toDateString()} and owner ${userId}. Doing nothing.`);
            }
        } catch (error) {
            console.error("Error in daily record: " , error)
        }
    }
}


module.exports = DailyRecordManager




