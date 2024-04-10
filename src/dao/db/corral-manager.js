const CorralModel = require("../models/corral.model.js");

class CorralManager {
  async addCorral({corral, owner }) {
    try {
      if (!corral) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      const newCorral = new CorralModel({
        corral,
        owner,
      });
      console.log(newCorral)
      await newCorral.save();
    } catch (error) {
      console.log(error);
    }
  }

  async getCorrals(userId) {
    try {
      const Corrals = await CorralModel.find({owner: userId});
      return Corrals;
    } catch (error) {
      console.log(error);
    }
  }

  async getCorralById(id) {
    try {
      const Corral = await CorralModel.findById(id);
      if (!Corral) {
        console.log("El Corral no existe");
      }

      return Corral;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCorral(id, updateCorral) {
    try {
      const updatedCorral = await CorralModel.findByIdAndUpdate(id, updateCorral);
      if (!updatedCorral) {
        console.log("El tratamiento no existe");
        return null
      }

      return updatedCorral;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCorral(id) {
    try {
      const deletedCorral = await CorralModel.findByIdAndDelete(id);
      if (!deletedCorral) {
        console.log("El tratamiento no existe");
      }
      return deletedCorral;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CorralManager;
