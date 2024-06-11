const CalfStopMilkingModel = require("../models/calfStopMilking.model.js")
const CalfStopMilkingProtocolModel = require("../models/calfStopMilkingProtocol.model.js")
const moment = require("moment-timezone");
const CalfManager = require("../db/calf-manager.js")
const calfManager = new CalfManager()

class StopMilkingManager { 
    async newStopMilkingProtocol(protocolData){
        try {
          const newProtocol = new CalfStopMilkingProtocolModel(protocolData)
          await newProtocol.save()
        } catch (error) {
          console.log(error)
        }
    }

    async deleteStopMilkingProtocol(id){
      try {
        const deletedProtocol = await CalfStopMilkingProtocolModel.findByIdAndDelete(id)
        return deletedProtocol
      } catch (error) {
        console.log(error)
      }
    }
    
    async getStopMilkingProtocol(owner){
      try {
        const protocol = await CalfStopMilkingProtocolModel.findOne({owner:owner})
        return protocol
      } catch (error) {
        console.log(error)
      }
    }
    

    async getStopMilkingCalves(owner){
      try {
        const endOfToday = moment().endOf("day").toDate();
        const startOfToday = moment().startOf('day').toDate();      
        const stopMilkingCalves = await CalfStopMilkingModel.find({
          owner: owner,
          stopStopMilkingDate: { $gte: startOfToday } 
        })
        return stopMilkingCalves
      } catch (error) {
        console.log(error)
      }
    }


    async getStopMilkingCalvesForNextWeek(owner){
      try {
        const endOfWeek = moment().endOf("week")
      } catch (error) {
        console.log(error)
      }
    }

    async stopMilkingCalf(calfId, owner){
        try {
            const calf = await calfManager.getCalfById(calfId)
            calf.stopMilking = true
            const calfName = calf.name
            const currentTime = moment()
            const startStopMilking = moment()
            const stopMilkingProtocol = await CalfStopMilkingProtocolModel.findOne({owner:owner})
            const { stopMilkingProtocolDuration } = stopMilkingProtocol
            const stopStopMilkingDate =  currentTime.add(stopMilkingProtocolDuration - 1, "days")
            const formattedStopStopMilkingDate = stopStopMilkingDate.format("YYYY-MM-DD")
            
            
            await calf.save()
            const newCalfStopMilking = new CalfStopMilkingModel({
              name: calfName,
              owner: owner,
              startStopMilkingDate: startStopMilking,
              stopStopMilkingDate: formattedStopStopMilkingDate,
              stopMilkingProtocol: stopMilkingProtocol._id
            });
            await newCalfStopMilking.save(); 
            return newCalfStopMilking       
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = StopMilkingManager