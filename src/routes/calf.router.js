const express = require("express");
const router = express.Router();
const CalfManager = require("../dao/db/calf-manager.js");
const calfManager = new CalfManager();
const moment = require("moment-timezone");

router.post("/add", async (req, res) => {
  try {
    const owner = req.session.user._id;
    const { name, birthDate, calfWeight, calfCalostro, gender, birthType } =
      req.body;

    const newBirthDate = moment(birthDate).add(12, "hours").toDate();
    const newCalf = {
      name: name,
      birthDate: newBirthDate,
      birthType: birthType,
      calfWeight: calfWeight,
      calfCalostro: calfCalostro,
      gender: gender,
      owner: owner,
    };

    const result = await calfManager.addCalf(newCalf);

    if (result.success) {
      res.status(201).json(result);
    } else if (result.message.includes("ya existe")) {
      res.status(409).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error, inténtelo nuevamente." });
    console.error(error);
  }
});
router.post("/addtoTreatment", async (req, res) => {
  try {
    const owner = req.session.user._id;
    const {
      name,
      startDate,
      endDate,
      duration,
      treatmentId,
      corral,
      corralId,
    } = req.body;
    console.log(treatmentId);
    const newStartDate = moment(startDate).add(0, "hours").toDate();
    const newEndDate = moment(endDate).add(0, "hours").toDate();
    const yesterday = moment(startDate).subtract(1, "day").toDate();
    const newCalf = {
      name: name,
      startDate: newStartDate,
      duration: duration,
      endDate: newEndDate,
      owner: owner,
      corral: corral,
      corralId: corralId,
      lastDayTreated: yesterday,
      treatmentId: treatmentId,
    };

    await calfManager.addCalfToTreatment(newCalf);
    res.status(200).json({
      success: true,
      message: "Ternero agregado con éxito",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error, intentelo nuevamente",
    });
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
    if (newCalfData.birthDate) {
      newCalfData.birthDate = moment
        .tz(newCalfData.birthDate, "America/Argentina/Buenos_Aires")
        .startOf("day")
        .toDate();
    }
    const result = await calfManager.updateCalf(cid, newCalfData);
    if (result.success) {
      res.status(200).json(result);
    } else if (result.message.includes("ya existe")) {
      res.status(409).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete/:cid", async (req, res) => {
  try {
    const result = await calfManager.deleteCalf(req.params.cid);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/resetTreatment", async (req, res) => {
  try {
    const { calfId, newTreatment, newTitle, newMedication, newDuration } =
      req.body;

    if (!calfId || !newTreatment || !newMedication || !newDuration) {
      throw new Error("Faltan datos requeridos");
    }

    const medicationArray = JSON.parse(newMedication);

    const today = moment.tz("America/Argentina/Buenos_Aires");
    const endDate = today.clone().add(parseInt(newDuration, 10), "days");
    const newEndDate = endDate.clone().subtract(1, "days");

    const newTreatmentData = [
      {
        _id: newTreatment,
        title: newTitle,
        duration: parseInt(newDuration, 10),
        medication: medicationArray,
      },
    ];

    const newCalf = await calfManager.updateCalf(calfId, {
      treatment: newTreatmentData,
      startDate: today.toDate(),
      endDate: newEndDate.toDate(),
      resetTreatment: true,
    });

    if (!newCalf) {
      throw new Error("Ternero no encontrado o no actualizado");
    }

    console.log("Ternero actualizado:", newCalf);
    res.redirect("/enfermeria/terneros-por-terminar-tratamiento");
  } catch (error) {
    console.error("Error al reiniciar tratamiento:", error);
    res.status(500).send("Error al reiniciar el tratamiento");
  }
});

module.exports = router;

router.post("/finishTreatment", async (req, res) => {
  try {
    const { calfId, treatmentTitle, endDate } = req.body;

    if (!calfId || !treatmentTitle || !endDate) {
      throw new Error("Faltan datos requeridos");
    }

    const updatedCalf = await calfManager.updateCalf(
      calfId,
      {
        finished: true,
        prevTreatment: treatmentTitle,
        prevEndDate: endDate,
        resetTreatment: false,
      },
      { new: true }
    );

    if (!updatedCalf) {
      throw new Error("Ternero no encontrado o no actualizado");
    }

    console.log("Ternero actualizado:", updatedCalf);
    res.redirect("/enfermeria/terneros-por-terminar-tratamiento");
  } catch (error) {
    console.error("Error al finalizar tratamiento:", error);
    res.status(500).send("Error al finalizar el tratamiento");
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
    console.log("Router - ID del ternero:", calfId, "Peso recibido:", weight); // Depuración
    if (!weight) throw new Error("No se recibió peso del ternero");
    const currentTime = moment.tz("America/Argentina/Buenos_Aires").toDate();
    const releasedCalf = await calfManager.releaseCalf(
      calfId,
      weight,
      currentTime
    );
    const referer = req.headers.referer;

    res.status(200).json({
      success: true,
      message: "El ternero ha sido liberado exitosamente.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Hubo un problema al procesar la solicitud.",
    });
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
