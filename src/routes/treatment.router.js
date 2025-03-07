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
    res.redirect("/enfermeria");
  } catch (error) {
    res.json({ message: "Error, intentelo nuevamente" });
    console.log(error);
  }
});

router.post("/update/:cid", async (req,res) => {
  try {
    const newTreatment = await treatmentManager.updateTreatment(req.params.cid, req.body)
    console.log(newTreatment)
    res.redirect("/enfermeria")
  } catch (error) {
    console.log(error)
  }
})

router.post("/delete:cid", async (req,res) => {
  try {
    const deletedTreatment = await treatmentManager.deleteTreatment(req.params.cid)
    console.log(deletedTreatment)
    res.redirect("/enfermeria")
  } catch (error) {
    console.log(error)
  }
})

module.exports = router