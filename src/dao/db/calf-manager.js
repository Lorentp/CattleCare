const CalfModel = require("../models/calf.model.js");
const moment = require("moment-timezone");

class CalfManager {
  async addCalf({
    name,
    treatment,
    startDate,
    owner,
    endDate,
    duration,
    medication,
    corral,
    corralId,
    lastDayTreated,
  }) {
    try {
      if (!name || !treatment || !startDate) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      let calfExist = await CalfModel.findOne({ owner: owner, name: name });

      if (calfExist) {
        calfExist.treatment = treatment;
        calfExist.startDate = startDate;
        calfExist.endDate = endDate;
        calfExist.duration = duration;
        calfExist.medication = medication;
        calfExist.corral = corral;
        calfExist.corralId = corralId;
        calfExist.lastDayTreated = lastDayTreated;
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
          lastDayTreated,
        });
        await newCalf.save();
        console.log("Nuevo ternero creado:", newCalf);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCalves(userId, search, sortOrder, fromDate, toDate) {
    try {
      let query = { owner: userId, isDead: { $in: [false, undefined] } }
      if (search) {
        query.name = { $regex: search };
      }

      if (fromDate && toDate) {
        query.endDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };
      }
      let sortOption = {};
       if (sortOrder === 'asc') {
          sortOption = { name: 1 }; 
      } else {
          sortOption = { name: -1 }; 
      }


      const calves = await CalfModel.find(query).sort(sortOption);
      
      return calves;
    } catch (error) {
      console.log(error);
    }
  }

  async getActiveCalvesNotTreated(userId, today) {
    try {
      const startOfToday = moment(today).startOf("day");

      const activeCalves = await CalfModel.find({
        owner: userId,
        endDate: { $gte: startOfToday },
        isDead: { $in: [false, undefined] }
      });

      const notTreatedToday = activeCalves.filter((calf) => {
        return moment(calf.lastDayTreated)
          .startOf("day")
          .isBefore(startOfToday);
      });

      return notTreatedToday;
    } catch (error) {
      console.log(error);
    }
  }

  async getActiveCalvesTreated(userId, today) {
    try {
      const startOfToday = moment(today).startOf("day");

      const activeCalves = await CalfModel.find({
        owner: userId,
        endDate: { $gte: startOfToday },
        isDead: { $in: [false, undefined] }
      });

      const notTreatedToday = activeCalves.filter((calf) => {
        return moment(calf.lastDayTreated).startOf("day").isSame(startOfToday);
      });

      return notTreatedToday;
    } catch (error) {
      console.log(error);
    }
  }

  async getYesterdayCalves(userId, yesterday) {
    const today = moment().tz("America/Argentina/Buenos_Aires");
    const endOfYesterday = today.clone().subtract(1, "days").endOf("day");

    try {
      const yesterdayCalves = await CalfModel.find({
        owner: userId,
        endDate: { $lte: endOfYesterday.toDate()},
        finished: false,
        isDead: { $in: [false, undefined] }
      });

      return yesterdayCalves;
    } catch (error) {
      console.log(error);
    }
  }

  async getCalvesByCorral(userId, corral, today) {
    try {
      const startOfToday = moment(today).startOf("day");
      const calvesInCorral = await CalfModel.find({
        owner: userId,
        corralId: corral,
        endDate: { $gte: startOfToday },
        isDead: { $in: [false, undefined] }
      });
      return calvesInCorral;
    } catch (error) {
      console.log(error);
    }
  }

  async getCalvesByCorralNotTreated(userId, corral, today) {
    try {
      const startOfToday = moment(today).startOf("day");

      const activeCalves = await CalfModel.find({
        owner: userId,
        corralId: corral,
        endDate: { $gte: startOfToday },
        isDead: { $in: [false, undefined] }
      });

      const calvesNotTreatedTodayInCorral = activeCalves.filter((calf) => {
        return moment(calf.lastDayTreated)
          .startOf("day")
          .isBefore(startOfToday);
      });

      return calvesNotTreatedTodayInCorral;
    } catch (error) {
      console.log(error);
    }
  }

  async getCalvesByCorralTreated(userId, corral, today) {
    try {
      const startOfToday = moment(today).startOf("day");

      const activeCalves = await CalfModel.find({
        owner: userId,
        corralId: corral,
        endDate: { $gte: startOfToday },
        isDead: { $in: [false, undefined] }
      });

      const calvesTreatedTodayInCorral = activeCalves.filter((calf) => {
        return moment(calf.lastDayTreated).startOf("day").isSame(startOfToday);
      });

      return calvesTreatedTodayInCorral;
    } catch (error) {
      console.log(error);
    }
  }

  async getDeadCalf(userId, search, sortOrder, fromDate, toDate){
    try {
      let query = { owner: userId, isDead: true };
      if (search) {
        query.name = { $regex: search };
      }
      if (fromDate && toDate) {
        query.timeDead = { $gte: new Date(fromDate), $lte: new Date(toDate) };
      }
      
      let sortOption = {};
      if (sortOrder === 'asc') {
        sortOption = { name: 1 }; 
      } else {
        sortOption = { name: -1 }; 
     }
      const calves = await CalfModel.find(query).sort(sortOption);
      return calves;
    } catch (error) {
      console.log(error);
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

  async markAsTreated(calfId, currentTime) {
    try {
      const calf = await CalfModel.findById(calfId);
      calf.lastDayTreated = currentTime;
      const updatedCalf = await calf.save();

      return updatedCalf;
    } catch (error) {
      console.log(error);
    }
  }

  async calfDie(calfId, currentTime, comment) { 
    try {

      
      const calf = await CalfModel.findById(calfId)
      calf.isDead = true
      calf.timeDead = currentTime
      calf.comment = comment
      const deadCalf = await calf.save()
      return deadCalf
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = CalfManager;
