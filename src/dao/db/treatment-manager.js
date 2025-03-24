const TreatmentsModel = require("../models/treatment.model.js");

class TreatmentsManager {
  async addTreatment({
    title,
    day1,
    day2,
    day3,
    day4,
    day5,
    day6,
    day7,
    day8,
    day9,
    day10,
    duration,
    owner,
  }) {
    try {
      const medication = [
        day1,
        day2,
        day3,
        day4,
        day5,
        day6,
        day7,
        day8,
        day9,
        day10,
      ];
      const filteredMedication = medication.filter((day) => day);
      const newTreatment = new TreatmentsModel({
        title,
        duration,
        owner,
        medication: filteredMedication,
      });

      await newTreatment.save();
    } catch (error) {
      console.log(error);
    }
  }

  async getTreatments(userId) {
    try {
      const treatments = await TreatmentsModel.find({ owner: userId });
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
      const updatedTreatment = await TreatmentsModel.findByIdAndUpdate(
        id,
        {
          title: updateTreatment.title,
          duration: updateTreatment.duration,
          medication: updateTreatment.medication,
        },
        { new: true }
      );

      return updatedTreatment;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTreatment(id) {
    try {
      const deletedTreatment = await TreatmentsModel.findByIdAndDelete(id);
      if (!deletedTreatment) {
        return {
          success: false,
          message: "El tratamiento no existe"
        }
      }

      return  {
        success:true,
        message:"Tratamiento eliminado con exito"
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = TreatmentsManager;
