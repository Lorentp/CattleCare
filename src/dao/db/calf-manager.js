const CalfModel = require("../models/calf.model.js");
const moment = require("moment-timezone")

class CalfManager {
  async addCalf({ name, treatment, startDate, owner, endDate, duration, medication, corral, corralId, lastDayTreated}) {
    try {
      if (!name || !treatment || !startDate) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      let calfExist = await CalfModel.findOne({owner:owner, name:name})

      if (calfExist) {
        calfExist.treatment = treatment;
        calfExist.startDate = startDate;
        calfExist.endDate = endDate;
        calfExist.duration = duration;
        calfExist.medication = medication;
        calfExist.corral = corral;
        calfExist.corralId = corralId;
        calfExist.lastDayTreated = lastDayTreated
        await calfExist.save();
        console.log("Ternero actualizado:", calfExist);
      } else {
        // Si no existe, crear un nuevo ternero
        const newCalf = new CalfModel({
          name,
          treatment,
          startDate,
          endDate,
          duration,
          medication,
          owner,
          corral,
          corralId,
          lastDayTreated
        });
        await newCalf.save();
        console.log("Nuevo ternero creado:", newCalf);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCalves(userId) {
    try {
      const calves = await CalfModel.find({owner: userId});
      return calves;
    } catch (error) {
      console.log(error);
    }
  }

  async getActiveCalvesNotTreated(userId, today) {
    try {
      const startOfToday = moment(today).startOf("day");

      const activeCalves = await CalfModel.find({owner:userId, endDate: {$gte:today}})

      const notTreatedToday = activeCalves.filter(calf => {
        
        return moment(calf.lastDayTreated).startOf("day").isBefore(startOfToday);
    });

      return notTreatedToday
    } catch (error) {
      console.log(error)
    }
  }


  async getActiveCalvesTreated(userId, today) {
    try {
      const startOfToday = moment(today).startOf("day");

      const activeCalves = await CalfModel.find({owner:userId, endDate: {$gte:today}})

      const notTreatedToday = activeCalves.filter(calf => {
        
        return moment(calf.lastDayTreated).startOf("day").isSame(startOfToday);
    });

     
    return notTreatedToday
    } catch (error) {
      console.log(error)
    }
  }

  async getYesterdayCalves (userId, yesterday) {

    const startOfYesterday = new Date(yesterday)
    startOfYesterday.setHours(0,0,0,0)
    const endOfYesterday = new Date(yesterday)
    endOfYesterday.setHours(23, 59,59, 999)
    
  
    try {   
      const yesterdayCalves = await CalfModel.find({owner:userId, endDate:{ $gte: startOfYesterday, $lte:endOfYesterday}})
      
      return yesterdayCalves
    } catch (error) {
      console.log(error)    
    }
  }

  async getCalvesByCorral(userId, corral, today){
    try {
      const calvesInCorral = await CalfModel.find({owner:userId, corralId: corral, endDate: {$gte:today}})
      return calvesInCorral
    } catch (error) {
      console.log(error)
    }
  }


  async getCalvesByCorralNotTreated(userId, corral, today){
    try {
      const startOfToday = moment(today).startOf("day");

      const activeCalves = await CalfModel.find({owner:userId, corralId: corral, endDate: {$gte:today}})

      const calvesNotTreatedTodayInCorral = activeCalves.filter(calf => {
        
        return moment(calf.lastDayTreated).startOf("day").isBefore(startOfToday);
    });

      return calvesNotTreatedTodayInCorral
    } catch (error) {
      console.log(error)
    }
  }

  async getCalvesByCorralTreated(userId, corral, today){
    try {
      const startOfToday = moment(today).startOf("day");
  
        const activeCalves = await CalfModel.find({owner:userId, corralId: corral, endDate: {$gte:today}})
  
        const calvesTreatedTodayInCorral = activeCalves.filter(calf => {
          
        return moment(calf.lastDayTreated).startOf("day").isSame(startOfToday);
      });
  
        return calvesTreatedTodayInCorral
    } catch (error) {
      console.log(error)
    }
  }
  async getCalfById(id) {
    try {
      const calf = await CalfModel.findById(id);
      if (!calf) {
        console.log("El ternero no existe");
        return;
      }

      return calf;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCalf(id, updatedCalfData) {
    try {
      const updatedCalf = await CalfModel.findByIdAndUpdate(
        id,
        updatedCalfData
      );

      if (!updatedCalf) {
        console.log("El ternero no existe");
        return;
      }

      return updatedCalf;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCalf(id) {
    try {
      const deletedCalf = await CalfModel.findByIdAndDelete(id);
      if (!deletedCalf) {
        console.log("El ternero no existe");
      }

      return deletedCalf;
    } catch (error) {
      console.log(error);
    }
  }


  async markAsTreated(calfId) {
    try {
      const calf = await CalfModel.findById(calfId);
      calf.lastDayTreated = moment();
      const updatedCalf = await calf.save();

    return updatedCalf;
    } catch (error) {
     console.log(error) 
    }
  }
}

module.exports = CalfManager;
