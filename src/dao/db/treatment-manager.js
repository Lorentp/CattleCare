const TreatmentsModel = require("../models/treatment.model.js");

class TreatmentsManager {
  async addTreatment({ title, medication, duration, owner }) {
    try {
      if (!title || !medication || !duration) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      const newTreatment = new TreatmentsModel({
        title,
        medication,
        duration,
        owner,
      });
      console.log(newTreatment)
      await newTreatment.save();
    } catch (error) {
      console.log(error);
    }
  }

  async getTreatments(userId) {
    try {
      const treatments = await TreatmentsModel.find({owner: userId});
      return treatments;
    } catch (error) {
      console.log(error);
    }
  }

  async getTreatmentById(id) {
    try {
      const treatment = await TreatmentsModel.findById(id);
      if (!treatment) {
        console.log("El tratamiento no existe");
      }

      return treatment;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTreatment(id, updateTreatment) {
    try {
      const updatedtreatment = await TreatmentsModel.findByIdAndUpdate(id, updateTreatment);
      if (!updatedtreatment) {
        console.log("El tratamiento no existe");
        return null
      }

      return updatedtreatment;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTreatment(id) {
    try {
      const deletedTreatment = await TreatmentsModel.findByIdAndDelete(id);
      if (!deletedTreatment) {
        console.log("El tratamiento no existe");
      }
      return deletedTreatment;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = TreatmentsManager;
