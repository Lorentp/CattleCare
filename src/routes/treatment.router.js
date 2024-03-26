const express = require("express");
const router = express.Router();

const TreatmentsManager = require("../dao/db/treatment-manager.js");
const treatmentManager = new TreatmentsManager();

router.post("/add", async (req, res) => {
  try {
    const owner = req.session.user._id
    const newTreatment = req.body;
    newTreatment.owner = owner
    await treatmentManager.addTreatment(newTreatment);
    console.log(newTreatment)
    res.redirect("/agregar");
  } catch (error) {
    res.json({ message: "Error, intentelo nuevamente" });
    console.log(error);
  }
});

module.exports = router