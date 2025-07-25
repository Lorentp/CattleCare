const CalfModel = require("../models/calf.model.js");
const TreatmentModel = require("../models/treatment.model.js");
const moment = require("moment-timezone");

class CalfManager {
  async addCalf({
    name,
    birthDate,
    gender,
    birthType,
    calfWeight,
    calfCalostro,
    mother,
    owner,
  }) {
    try {
      let calfExist = await CalfModel.findOne({ owner: owner, name: name });

      if (calfExist) {
        // Si existe, devolver un error indicando duplicado
        return {
          success: false,
          message: "El ternero con esta caravana ya existe, intentelo de nuevo",
        };
      }

      const newCalf = new CalfModel({
        name,
        birthDate,
        calfWeight,
        calfCalostro,
        gender,
        birthType,
        mother,
        owner,
      });
      await newCalf.save();
      return {
        success: true,
        message: "Ternero creado con éxito",
      };
    } catch (error) {
      console.log(error);
    }
  }

  async addCalfToTreatment({
    name,
    treatmentId,
    startDate,
    owner,
    endDate,
    corral,
    corralId,
    lastDayTreated,
  }) {
    try {
      const treatment = await TreatmentModel.findById(treatmentId);
      let calfExist = await CalfModel.findOne({ owner: owner, name: name });
      if (calfExist) {
        calfExist.treatment = treatment; // Asignamos el array completo
        calfExist.startDate = startDate;
        calfExist.endDate = endDate;
        calfExist.corral = corral;
        calfExist.corralId = corralId;
        calfExist.lastDayTreated = lastDayTreated;
        calfExist.resetTreatment = false; // Reseteamos si había un reset
        await calfExist.save();
        console.log("Ternero actualizado:", calfExist);
      } else {
        // Si no existe, crear un nuevo ternero
        const newCalf = new CalfModel({
          name,
          treatment: treatment,
          startDate,
          endDate,
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
      let query = {
        owner: userId,
        isDead: { $in: [false, undefined] },
        isReleased: { $in: [false, undefined] },
      };
      if (search) {
        query.name = { $regex: search };
      }

      if (fromDate && toDate) {
        query.birthDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };
      }
      let sortOption = {};
      if (sortOrder === "asc") {
        sortOption = { name: 1 };
      } else {
        sortOption = { name: 1 };
      }

      const calves = await CalfModel.find(query).sort(sortOption);

      return calves;
    } catch (error) {
      console.log(error);
    }
  }

  async getCalvesBirth(userId, fromDate, toDate) {
    try {
      let query = {
        owner: userId,
      };

      if (fromDate && toDate) {
        query.birthDate = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        };
      }
      const calvesBirth = await CalfModel.find(query);

      return calvesBirth;
    } catch (error) {
      console.log(error);
    }
  }

  async getCalvesTreated(userId, fromDate, toDate) {
    try {
      let query = {
        owner: userId,
      };
      if (fromDate && toDate) {
        query.startDate = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        };
      }

      const treatedCalves = await CalfModel.find(query);

      return treatedCalves;
    } catch (error) {
      console.log(error);
    }
  }

  async getTreatedCalves(userId, search, sortOrder, fromDate, toDate) {
    try {
      let query = {
        owner: userId,
        isDead: { $in: [false, undefined] },
        treatment: { $exists: true, $ne: null, $ne: [] },
      };
      if (search) {
        query.name = { $regex: search };
      }

      if (fromDate && toDate) {
        query.endDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };
      }
      let sortOption = {};
      if (sortOrder === "asc") {
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

  async getReleasedCalves(userId, search, sortOrder, fromDate, toDate) {
    try {
      let query = {
        owner: userId,
        isDead: { $in: [false, undefined] },
        isReleased: true,
      };
      if (search) {
        query.name = { $regex: search };
      }

      if (fromDate && toDate) {
        query.whenReleased = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        };
      }
      let sortOption = {};
      if (sortOrder === "asc") {
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
        isDead: { $in: [false, undefined] },
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
        isDead: { $in: [false, undefined] },
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
        endDate: { $lte: endOfYesterday.toDate() },
        finished: false,
        isDead: { $in: [false, undefined] },
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
        isDead: { $in: [false, undefined] },
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
        isDead: { $in: [false, undefined] },
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
        isDead: { $in: [false, undefined] },
      });

      const calvesTreatedTodayInCorral = activeCalves.filter((calf) => {
        return moment(calf.lastDayTreated).startOf("day").isSame(startOfToday);
      });

      return calvesTreatedTodayInCorral;
    } catch (error) {
      console.log(error);
    }
  }

  async getDeadCalf(userId, search, sortOrder, fromDate, toDate) {
    try {
      let query = { owner: userId, isDead: true };
      if (search) {
        query.name = { $regex: search };
      }
      if (fromDate && toDate) {
        query.timeDead = { $gte: new Date(fromDate), $lte: new Date(toDate) };
      }

      let sortOption = {};
      if (sortOrder === "asc") {
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
      const currentCalf = await CalfModel.findById(id);
      if (!currentCalf) {
        return {
          success: false,
          message: "El ternero no existe",
        };
      }
      const calfWithNewName = await CalfModel.findOne({
        name: updatedCalfData.name,
        owner: currentCalf.owner, // Solo revisar el mismo propietario
        _id: { $ne: id }, // Excluir el ternero actual
      });
      if (calfWithNewName) {
        return {
          success: false,
          message: "Ya existe otro ternero con esta carvana",
        };
      }

      const updatedCalf = await CalfModel.findByIdAndUpdate(
        id,
        updatedCalfData,
        { new: true }
      );
      return {
        success: true,
        message: "Ternero actualizado con exito",
        data: updatedCalf,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCalf(id) {
    try {
      const deletedCalf = await CalfModel.findByIdAndDelete(id);

      if (!deletedCalf) {
        return {
          success: false,
          message: "El ternero no existe",
        };
      }

      return {
        success: true,
        message: "Ternero eliminado con éxito",
        data: deletedCalf,
      };
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

  async updateWeight(calfId, weightInput) {
    try {
      const calf = await CalfModel.findById(calfId);
      calf.calfWeight = weightInput;
      const updatedCalf = await calf.save();
      console.log(updatedCalf);
      return updatedCalf;
    } catch (error) {
      console.log(error);
    }
  }
  async updateBirthDate(calfId, dateInput) {
    try {
      const calf = await CalfModel.findById(calfId);
      const newBirthDate = moment(dateInput).toDate();
      calf.birthDate = newBirthDate;
      const updatedCalf = await calf.save();
      console.log(updatedCalf);
      return updatedCalf;
    } catch (error) {
      console.log(error);
    }
  }

  async updateColostrum(calfId, colostrumInput) {
    try {
      const calf = await CalfModel.findById(calfId);
      calf.calfCalostro = colostrumInput;
      const updatedCalf = await calf.save();
      console.log(updatedCalf);
      return updatedCalf;
    } catch (error) {
      console.log(error);
    }
  }

  async releaseCalf(calfId, weightReleasedInput, whenReleasedInput) {
    try {
      const calf = await CalfModel.findById(calfId);

      const birthDate = moment(calf.birthDate);
      const whenReleased = moment(whenReleasedInput); // Asegura que sea un objeto moment

      const daysInGuachera = whenReleased.diff(birthDate, "days");

      if (calf.calfWeight) {
        const currentWeight = parseFloat(weightReleasedInput);
        const birthWeight = parseFloat(calf.calfWeight);
        const weightDiference = currentWeight - birthWeight;
        const weightGainPerDay = weightDiference / daysInGuachera;
        const formattedWeightGainPerDay = parseFloat(
          weightGainPerDay.toFixed(3)
        );
        calf.releasedWeight = weightReleasedInput;
        calf.weightDiference = weightDiference;
        calf.weightGainPerDay = formattedWeightGainPerDay;

        calf.isReleased = true;
        calf.whenReleased = whenReleased.toDate(); // Guarda como Date
        calf.daysInGuachera = daysInGuachera;

        const releasedCalf = await calf.save();
        console.log(releasedCalf);
        return releasedCalf;
      } else {
        calf.isReleased = true;
        calf.whenReleased = whenReleased.toDate();
        calf.daysInGuachera = daysInGuachera;
        calf.releasedWeight = weightReleasedInput;
        const releasedCalf = await calf.save();
        console.log(releasedCalf);
        return releasedCalf;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async calfDie(calfId, timeDead, comment) {
    try {
      const calf = await CalfModel.findById(calfId);
      calf.isDead = true;
      calf.timeDead = timeDead; // Already expects a Date object
      calf.comment = comment;
      const deadCalf = await calf.save();
      console.log("Ternero marcado como muerto:", deadCalf);
      return deadCalf;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CalfManager;
