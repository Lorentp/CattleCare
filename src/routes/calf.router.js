const express = require("express");
const router = express.Router();
const CalfManager = require("../dao/db/calf-manager.js");
const calfManager = new CalfManager();
const moment = require("moment-timezone");

router.post("/add", async (req, res) => {
  try {
    const owner = req.session.user._id;
    const {
      name,
      startDate,
      treatment,
      endDate,
      duration,
      medication,
      corral,
      corralId,
    } = req.body;

    const newStartDate = moment(startDate).add(0, "hours").toDate();
    const newEndDate = moment(endDate).add(0, "hours").toDate();
    const yesterday = moment(startDate).subtract(1, "day").toDate();
    const newCalf = {
      name: name,
      startDate: newStartDate,
      treatment: treatment,
      duration: duration,
      medication: medication,
      endDate: newEndDate,
      owner: owner,
      corral: corral,
      corralId: corralId,
      lastDayTreated: yesterday,
    };

    await calfManager.addCalf(newCalf);
    res.redirect("/home");
  } catch (error) {
    res.json({ message: "Error, intentelo nuevamente" });
    console.log(error);
  }
});

router.post("/update:cid", async (req, res) => {
  try {
    const newCalf = await calfManager.updateCalf(req.params.cid, req.body);
    console.log(newCalf);
    res.redirect("/home");
  } catch (error) {
    res.json({ message: "Error" });
    console.log(error);
  }
});

router.post("/delete:cid", async (req, res) => {
  try {
    const deletedCalf = await calfManager.deleteCalf(req.params.cid);
    console.log(deletedCalf);
    res.redirect("/home");
  } catch (error) {
    console.log(error);
  }
});

router.post("/resetTreatment", async (req, res) => {
  try {
    const { calfId } = req.body;
    const calf = await calfManager.getCalfById(calfId);
    const today = moment.tz("America/Argentina/Buenos_Aires");
    const endDate = today.clone().add(calf.duration, "days");

    const newCalf = await calfManager.updateCalf(calfId, {
      startDate: today,
      endDate: endDate,
      resetTreatment: true,
    });
    console.log(newCalf);
    res.redirect("/terneros-en-tratamiento");
  } catch (error) {
    console.log(error);
  }
});

router.post("/finishTreatment", async (req, res) => {
  try {
    const { calfId, treatment, endDate } = req.body;

    const updatedCalf = await calfManager.updateCalf(
      calfId,
      {
        finished: true,
        prevTreatment: treatment,
        prevEndDate: endDate,
        resetTreatment: false,
      },
      { new: true }
    );
    console.log(updatedCalf);
    res.redirect("/home");
  } catch (error) {
    console.log(error);
  }
});

router.post("/treated/:id", async (req, res) => {
  try {
    const calfId = req.params.id;
    const treatedCalf = await calfManager.markAsTreated(calfId);

    const referer = req.headers.referer;

    if (referer && referer.includes("/terneros-en-tratamiento")) {
      res.redirect("/terneros-en-tratamiento");
    } else if (referer && referer.includes("/corral/")) {
      const dynamicRouteId = referer.split("/").pop();
      res.redirect(`/corral/${dynamicRouteId}`);
    } else {
      res.redirect("/home");
    }
    return treatedCalf;
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
