const express = require("express");
const router = express.Router();
const StopMilkingManager = require("../dao/db/calfStopMilking-manager");
const stopMilkingManager = new StopMilkingManager();

router.post("/calf/:id", async (req, res) => {
    try {
      const calfId = req.params.id;
      const owner = req.session.user._id
  
      const stopMilkingCalf = await stopMilkingManager.stopMilkingCalf(calfId, owner);
      const referer = req.headers.referer;
      console.log(stopMilkingCalf)
      if (referer && referer.includes("/terneros-guachera")) {
        res.redirect("/terneros-guachera");
      } else if (referer && referer.includes("/corral/")) {
        const dynamicRouteId = referer.split("/").pop();
        res.redirect(`/corral/${dynamicRouteId}`);
      } else {
        res.redirect("/home");
      }
      return stopMilkingCalf;
    } catch (error) {
      console.log(error);
    }
});

router.post("/protocol", async (req, res) => {
    try {
      const owner = req.session.user._id
      const {
        calfAgeToStart,
        stopMilkingProtocolDuration,
      } = req.body
      
      const stopMilkingDays = [];
      for (let i = 1; i <= stopMilkingProtocolDuration; i++) {
        stopMilkingDays.push(req.body[`stopMilkingDay${i}`]);
      }

      
      const newProtocol = {
        owner,
        calfAgeToStart,
        stopMilkingProtocolDuration,
        stopMilkingDays
      }
      await stopMilkingManager.newStopMilkingProtocol(newProtocol)
      console.log(newProtocol)
      res.redirect("/home")
    } catch (error) {
      console.log(error);
    }
});

router.post("/delete/:pid", async (req, res) => {
  try {
    const deletedProtocol = await stopMilkingManager.deleteStopMilkingProtocol(req.params.pid)
    console.log(deletedProtocol);
    res.redirect("/desleche-cargar");
  } catch (error) {
    console.log(error);
  }
});


module.exports = router