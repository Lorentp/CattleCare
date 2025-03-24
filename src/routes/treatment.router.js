const express = require("express");
const router = express.Router();

const TreatmentsManager = require("../dao/db/treatment-manager.js");
const treatmentManager = new TreatmentsManager();

router.post("/add", async (req, res) => {
  try {
    const owner = req.session.user._id;
    const newTreatment = req.body;
    newTreatment.owner = owner;

    await treatmentManager.addTreatment(newTreatment);

    res.status(200).json({
      success: true,
      message: "Tratamiento creado con éxito",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error, intentelo nuevamente",
    });
    console.log(error);
  }
});

router.post("/update/:cid", async (req, res) => {
  try {
    const treatmentId = req.params.cid;
    const formData = req.body;
    const updatedTreatment = await treatmentManager.updateTreatment(
      treatmentId,
      formData
    );

    res.status(200).json({
      success: true,
      message: "Tratamiento actualizado con éxito",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el tratamiento, intenta nuevamente.",
    });
  }
});

router.post("/delete/:cid", async (req, res) => {
  try {
    const result = await treatmentManager.deleteTreatment(
      req.params.cid
    );

    if(result.success){
      res.status(200).json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
