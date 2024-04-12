const express = require("express");
const router = express.Router();
const userModel = require("../dao/models/user.model.js")
const TreatmentsManager = require("../dao/db/treatment-manager.js");
const treatmentManager = new TreatmentsManager();
const CalfManager = require("../dao/db/calf-manager.js");
const calfManager = new CalfManager();
const CorralManager = require("../dao/db/corral-manager.js");
const corralManager = new CorralManager();
const moment = require("moment-timezone")

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
      return
    }
    userId = req.session.user._id
    const now = moment.tz("America/Argentina/Buenos_Aires")
    
    const today = now.startOf("day")
    corrals = await corralManager.getCorrals(userId)
    calves = await calfManager.getActiveCalves(userId, today)

    const yesterday = now.clone().subtract(1,"days")
    

    yesterdayCalves = await calfManager.getYesterdayCalves(userId, yesterday)  

    user = req.session.user 
    
    res.render("home", {calves, user, corrals, yesterdayCalves});
  } catch (error) {
    console.log("Error de servidor", error);
  }
});

router.get("/corral/:cid", async (req, res) => {
  try {
    if(!req.session.login){
      res.redirect("/")
      return
    }
    const userId = req.session.user._id
    const corral = req.params.cid

    const now = moment.tz("America/Argentina/Buenos_Aires")
    
    const today = now.toDate()
    const calvesInCorral = await calfManager.getCalvesByCorral(userId, corral, today)

    const thisCorral = await corralManager.getCorralById(corral)
    res.render("corral", {calvesInCorral, thisCorral})
  } catch (error) {
    console.log("Error de servidor", error);
  }
})

router.get("/terneros", async (req, res) => {
  try {
    if(!req.session.login){
      res.redirect("/")
      return
    }
    userId = req.session.user._id
    calves = await calfManager.getCalves(userId)
    res.render("calves", {calves})
  } catch (error) {
    console.log(error)
  }
})

router.get("/agregar", async (req, res) => {
  try {
    if(!req.session.login){
      res.redirect("/")
      return
    }
    userId = req.session.user._id
    treatments = await treatmentManager.getTreatments(userId)
    calves = await calfManager.getCalves(userId)
    corrals = await corralManager.getCorrals(userId)
    res.render("addcalf", {treatments, calves, corrals});
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
