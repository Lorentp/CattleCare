const express = require("express");
const router = express.Router();
const TreatmentsManager = require("../dao/db/treatment-manager.js");
const treatmentManager = new TreatmentsManager();
const CalfManager = require("../dao/db/calf-manager.js");
const calfManager = new CalfManager();


router.get("/", async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log("Error del servidor", error);
  }
});

router.get("/home", async (req, res) => {
  try {
    if(!req.session.login){
      res.redirect("/")
    }
    userId = req.session.user._id
    calves = await calfManager.getCalves(userId)
    res.render("home", {calves});
  } catch (error) {
    console.log("Error de servidor", error);
  }
});

router.get("/agregar", async (req, res) => {
  try {
    if(!req.session.login){
      res.redirect("/")
    }
    userId = req.session.user._id
    treatments = await treatmentManager.getTreatments(userId)
    res.render("addcalf", {treatments});
  } catch (error) {
    console.log("Se ha producido un error", error);
  }
});

router.get("/registrar", async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log("Se ha producido un error", error);
  }
});
module.exports = router;
