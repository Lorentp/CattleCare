const CalfModel = require("../models/calf.model.js");

class CalfManager {
  async addCalf({ name, treatment, startDate, owner, endDate}) {
    try {
      if (!name || !treatment || !startDate) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      const calfExists = await CalfModel.findOne({ name: name });
      if (calfExists) {
        console.log("El ternero ya esta en tratamiento");
        return;
      }

      const newCalf = new CalfModel({
        name,
        treatment,
        startDate,
        endDate,
        owner,
      });
      console.log(newCalf)
      await newCalf.save();
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
}

module.exports = CalfManager;
