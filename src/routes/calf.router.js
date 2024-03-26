const express = require("express");
const router = express.Router();

const CalfManager = require("../dao/db/calf-manager.js");
const calfManager = new CalfManager();

function treatmentEndDate(startDate, duration){
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + duration)
  return endDate
}

router.post("/add", async (req, res) => {
  try {
    const owner = req.session.user._id
    const {name, startDate, treatment} = req.body
    const endDate = treatmentEndDate(startDate, treatment.duration)
    console.log(endDate)
    const newCalf = ({
      name: name,
      startDate: startDate,
      treatment: treatment,
      endDate: endDate,
      owner:owner
    })
  
    await calfManager.addCalf(newCalf);
    res.redirect("/home");
  } catch (error) {
    res.json({ message: "Error, intentelo nuevamente" });
    console.log(error);
  }
});

module.exports = router