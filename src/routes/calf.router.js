const express = require("express");
const router = express.Router();
const CalfManager = require("../dao/db/calf-manager.js");
const calfManager = new CalfManager();
const moment = require("moment-timezone");

router.post("/add", async (req, res) => {
  try {
    const owner = req.session.user._id;
    const { name, birthDate, calfWeight, calfCalostro, gender } = req.body;

    const newBirthDate = moment(birthDate).add(12, "hours").toDate();
    const newCalf = {
      name: name,
      birthDate: newBirthDate,
      calfWeight: calfWeight,
      calfCalostro: calfCalostro,
      gender: gender,
      owner: owner,
    };

    await calfManager.addCalf(newCalf);
    res.redirect("/terneros");
  } catch (error) {
    res.json({ message: "Error, intentelo nuevamente" });
    console.log(error);
  }
});
router.post("/addtoTreatment", async (req, res) => {
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

    await calfManager.addCalfToTreatment(newCalf);
    res.redirect("/enfermeria/terneros-en-tratamiento");
  } catch (error) {
    res.json({ message: "Error, intentelo nuevamente" });
    console.log(error);
  }
});

router.post("/update:cid", async (req, res) => {
  try {
    const newCalf = await calfManager.updateCalf(req.params.cid, req.body);
    console.log(newCalf);
    res.redirect("/enfermeria/terneros-en-tratamiento");
  } catch (error) {
    console.log(error);
  }
});
router.post("/updatename/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const newCalfData = req.body;
    const newCalf = await calfManager.updateCalf(cid, newCalfData);
    console.log(newCalf);
    res.redirect("/terneros");
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete:cid", async (req, res) => {
  try {
    const deletedCalf = await calfManager.deleteCalf(req.params.cid);
    console.log(deletedCalf);
    res.redirect("/enfermeria");
  } catch (error) {
    console.log(error);
  }
});

router.post("/resetTreatment", async (req, res) => {
  try {
    const { calfId, newTreatment, newMedication, newDuration } = req.body;
    const today = moment.tz("America/Argentina/Buenos_Aires");
    const endDate = today.clone().add(newDuration, "days");
    const newEndDate = endDate.clone().subtract(1, "days");

    const newCalf = await calfManager.updateCalf(calfId, {
      startDate: today,
      endDate: newEndDate,
      resetTreatment: true,
      medication: newMedication,
      duration: newDuration,
      treatment: newTreatment,
    });
    console.log(newCalf);
    res.redirect("/enfermeria/terneros-por-terminar-tratamiento");
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
    res.redirect("/enfermeria/terneros-por-terminar-tratamiento");
  } catch (error) {
    console.log(error);
  }
});

router.post("/weigh/:id", async (req, res) => {
  try {
    const calfId = req.params.id;
    const weight = req.body.weightInput;

    const weighedCalf = await calfManager.updateWeight(calfId, weight);
    const referer = req.headers.referer;

    if (referer && referer.includes("/terneros-guachera")) {
      res.redirect("/terneros-guachera");
    } else if (referer && referer.includes("/corral/")) {
      const dynamicRouteId = referer.split("/").pop();
      res.redirect(`/corral/${dynamicRouteId}`);
    } else {
      res.redirect("/home");
    }
    return weighedCalf;
  } catch (error) {
    console.log(error);
  }
});

router.post("/birth/:id", async (req, res) => {
  try {
    const calfId = req.params.id;
    const birth = req.body.birthDate;

    const birthDate = moment(birth).toDate();

    const birthCalf = await calfManager.updateBirthDate(calfId, birthDate);
    const referer = req.headers.referer;

    if (referer && referer.includes("/terneros-guachera")) {
      res.redirect("/terneros-guachera");
    } else if (referer && referer.includes("/corral/")) {
      const dynamicRouteId = referer.split("/").pop();
      res.redirect(`/corral/${dynamicRouteId}`);
    } else {
      res.redirect("/home");
    }
    return birthCalf;
  } catch (error) {
    console.log(error);
  }
});

router.post("/calostrum/:id", async (req, res) => {
  try {
    const calfId = req.params.id;
    const colostrum = req.body.calostrumInput;

    const colostrumCalf = await calfManager.updateColostrum(calfId, colostrum);
    const referer = req.headers.referer;

    if (referer && referer.includes("/terneros-guachera")) {
      res.redirect("/terneros-guachera");
    } else if (referer && referer.includes("/corral/")) {
      const dynamicRouteId = referer.split("/").pop();
      res.redirect(`/corral/${dynamicRouteId}`);
    } else {
      res.redirect("/home");
    }
    return colostrumCalf;
  } catch (error) {
    console.log(error);
  }
});

router.post("/released/:id", async (req, res) => {
  try {
    const calfId = req.params.id;
    const weight = req.body.releasedWeight;
    const currentTime = moment.tz("America/Argentina/Buenos_Aires").toDate();
    const releasedCalf = await calfManager.releaseCalf(
      calfId,
      weight,
      currentTime
    );
    const referer = req.headers.referer;

    if (referer && referer.includes("/terneros-guachera")) {
      res.redirect("/terneros-guachera");
    } else if (referer && referer.includes("/corral/")) {
      const dynamicRouteId = referer.split("/").pop();
      res.redirect(`/corral/${dynamicRouteId}`);
    } else {
      res.redirect("/home");
    }
    return releasedCalf;
  } catch (error) {
    console.log(error);
  }
});

router.post("/treated/:id", async (req, res) => {
  try {
    const calfId = req.params.id;
    const currentTime = moment.tz("America/Argentina/Buenos_Aires").toDate();
    const treatedCalf = await calfManager.markAsTreated(calfId, currentTime);

    const referer = req.headers.referer;

    if (referer && referer.includes("/enfermeria/terneros-en-tratamiento")) {
      res.redirect("/enfermeria/terneros-en-tratamiento");
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

router.post("/dead/:id", async (req, res) => {
  try {
    const calfId = req.params.id;
    const currentTime = moment.tz("America/Argentina/Buenos_Aires").toDate();
    const comment = req.body.comment;
    const deadCalf = await calfManager.calfDie(calfId, currentTime, comment);
    const referer = req.headers.referer;

    if (referer && referer.includes("/enfermeria/terneros-en-tratamiento")) {
      res.redirect("/enfermeria/terneros-en-tratamiento");
    } else if (referer && referer.includes("/enfermeria/corral/")) {
      const dynamicRouteId = referer.split("/").pop();
      res.redirect(`/enfermeria/corral/${dynamicRouteId}`);
    } else if (
      referer &&
      referer.includes("/enfermeria/terneros-por-terminar-tratamiento")
    ) {
      res.redirect("/enfermeria/terneros-por-terminar-tratamiento");
    } else {
      res.redirect("/terneros");
    }
    return deadCalf;
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
