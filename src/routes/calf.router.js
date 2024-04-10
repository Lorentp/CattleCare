const express = require("express");
const router = express.Router();

const CalfManager = require("../dao/db/calf-manager.js");
const calfManager = new CalfManager();

router.post("/add", async (req, res) => {
  try {
    const owner = req.session.user._id
    const {name, startDate, treatment, endDate, duration, medication, corral, corralId} = req.body      
    const newCalf = ({
      name: name,
      startDate: startDate,
      treatment: treatment,
      duration: duration,
      medication: medication,
      endDate: endDate,
      owner:owner,
      corral:corral,
      corralId: corralId,
    })
  
    await calfManager.addCalf(newCalf);
    res.redirect("/home");
  } catch (error) {
    res.json({ message: "Error, intentelo nuevamente" });
    console.log(error);
  }
});

router.post("/update:cid", async (req,res) => {
  try {
    const newCalf = await calfManager.updateCalf(req.params.cid, req.body)
    console.log(newCalf)
    res.redirect("/home")
  } catch (error) {
    res.json({message:"Error"})
    console.log(error)
  }
})

router.post("/delete:cid", async (req,res) => {
  try {
    const deletedCalf = await calfManager.deleteCalf(req.params.cid)
    console.log(deletedCalf)
    res.redirect("/home")
  } catch (error) {
    console.log(error)
  }
})


router.post ("/resetTreatment", async (req,res) => {
  try {
    const {calfId} = req.body
    const calf = await calfManager.getCalfById(calfId)
    const today = new Date()
    today.setDate(today.getDate() - 1)
    const endDate = new Date(today)
    endDate.setDate(endDate.getDate() + calf.duration - 1)
    const newCalf = await calfManager.updateCalf(calfId, { startDate:today, endDate: endDate, resetTreatment: true})
    console.log(newCalf)
    res.redirect("/home")
  } catch (error) {
    console.log(error)
  }
})


router.post("/finishTreatment", async (req, res) => {
  try {
    const { calfId, treatment, endDate } = req.body;
  
    const updatedCalf = await calfManager.updateCalf(
      calfId,
      { 
        finished: true,
        prevTreatment: treatment,
        prevEndDate: endDate,
        resetTreatment: false
      },
      { new: true } 
    );
    console.log(updatedCalf);
    res.redirect("/home");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router