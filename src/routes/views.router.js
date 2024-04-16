const express = require("express");
const router = express.Router();
const TreatmentsManager = require("../dao/db/treatment-manager.js");
const treatmentManager = new TreatmentsManager();
const CalfManager = require("../dao/db/calf-manager.js");
const calfManager = new CalfManager();
const CorralManager = require("../dao/db/corral-manager.js");
const corralManager = new CorralManager();
const moment = require("moment-timezone");

router.get("/", async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log("Error del servidor", error);
  }
});

router.get("/home", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    userId = req.session.user._id;

    user = req.session.user;

    res.render("home", { user });
  } catch (error) {
    console.log("Error de servidor", error);
  }
});

router.get("/terneros-en-tratamiento", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    const userId = req.session.user._id;
    const now = moment.tz("America/Argentina/Buenos_Aires");

    const today = now.toDate();
    const corrals = await corralManager.getCorrals(userId);
    const notTreatedcalves = await calfManager.getActiveCalvesNotTreated(
      userId,
      today
    );
    const treatedCalves = await calfManager.getActiveCalvesTreated(
      userId,
      today
    );
    let user = req.session.user;
    res.render("treating-calves", {
      treatedCalves,
      user,
      corrals,
      notTreatedcalves,
    });
  } catch (error) {
    console.log("Error de servidor", error);
  }
});

router.get("/terneros-por-terminar-tratamiento", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    userId = req.session.user._id;
    const now = moment.tz("America/Argentina/Buenos_Aires");

    const yesterday = now.clone().subtract(1, "days");
    const treatments = await treatmentManager.getTreatments(userId);
    const yesterdayCalves = await calfManager.getYesterdayCalves(userId, yesterday);
    const yesterdayCalvesWithContext = yesterdayCalves.map(calve => ({
      ...calve,
      treatments: treatments
    }));
    
    user = req.session.user;
    
    res.render("finishing-calves", { user, yesterdayCalvesWithContext });
  } catch (error) {
    console.log("Error de servidor", error);
  }
});

router.get("/corral/:cid", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    const userId = req.session.user._id;
    const corral = req.params.cid;

    const now = moment.tz("America/Argentina/Buenos_Aires");

    const today = now.toDate();
    const calvesInCorral = await calfManager.getCalvesByCorral(
      userId,
      corral,
      today
    );
    const calvesNotTreatedTodayInCorral =
      await calfManager.getCalvesByCorralNotTreated(userId, corral, today);
    const calvesTreatedTodayInCorral =
      await calfManager.getCalvesByCorralTreated(userId, corral, today);

    const thisCorral = await corralManager.getCorralById(corral);
    res.render("corral", {
      calvesInCorral,
      thisCorral,
      calvesTreatedTodayInCorral,
      calvesNotTreatedTodayInCorral,
    });
  } catch (error) {
    console.log("Error de servidor", error);
  }
});

router.get("/terneros", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    userId = req.session.user._id;
    let calves = await calfManager.getCalves(userId);

    res.render("calves", { calves });
  } catch (error) {
    console.log(error);
  }
});

router.get("/agregar", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    userId = req.session.user._id;
    treatments = await treatmentManager.getTreatments(userId);
    calves = await calfManager.getCalves(userId);
    corrals = await corralManager.getCorrals(userId);
    res.render("addcalf", { treatments, calves, corrals });
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
