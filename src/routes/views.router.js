const express = require("express");
const router = express.Router();
const TreatmentsManager = require("../dao/db/treatment-manager.js");
const treatmentManager = new TreatmentsManager();
const CalfManager = require("../dao/db/calf-manager.js");
const calfManager = new CalfManager();
const CorralManager = require("../dao/db/corral-manager.js");
const corralManager = new CorralManager();
const ScheduleManager = require("../dao/db/schedule-manager.js");
const scheduleManager = new ScheduleManager();
const StopMilkingManager = require("../dao/db/calfStopMilking-manager.js");
const stopMilkingManager = new StopMilkingManager();
const moment = require("moment-timezone");

//HOME

router.get("/registrar", async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log("Se ha producido un error", error);
  }
});

router.get("/", async (req, res) => {
  try {
    const errors = req.session.errors || {};
    delete req.session.errors;
    res.render("login", { errors });
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
    const tasks = await scheduleManager.getSchedules(userId);
    res.render("home", { user, tasks });
  } catch (error) {
    console.log("Error de servidor", error);
  }
});

router.get("/buscar-ternero", async(req,res) => {
  try {
    if(!req.session.login){
      res.redirect("/")
      return
    }
    const userId = req.session.user._id;
    const search = req.query.search || "";
    const sortOrder = req.query.sort || "asc";

    const calves = await calfManager.getCalves(userId, search, sortOrder);
    res.render("searchCalves", {calves})
  } catch (error) {
    console.log("Error de servidor", error)
  }
})


router.get("/terneros", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    const userId = req.session.user._id;
    const calves = await calfManager.getCalves(userId);
    const tasks = await scheduleManager.getSchedules(userId);
    const existingTitles = tasks.map((task) => task.title);

    const days = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    res.render("calves", {
      tasks,
      existingTitles: JSON.stringify(existingTitles),
      days,
      calves,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/terneros-guachera", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    const userId = req.session.user._id;
    const search = req.query.search || "";
    const sortOrder = req.query.sort || "asc";
    const fromDate = req.query.fromDate || null;
    const toDate = req.query.toDate || null;

    const corrals = await corralManager.getCorrals(userId);
    const calves = await calfManager.getCalves(userId, search, sortOrder, fromDate, toDate);

    res.render("allCalves", { calves, corrals });
  } catch (error) {
    console.log(error);
  }
});
router.get("/terneros-recria", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    const userId = req.session.user._id;
    const search = req.query.search || "";
    const sortOrder = req.query.sort || "asc";
    const fromDate = req.query.fromDate || null;
    const toDate = req.query.toDate || null;

    const corrals = await corralManager.getCorrals(userId);
    const calvesReleased = await calfManager.getReleasedCalves(
      userId,
      search,
      sortOrder,
      fromDate,
      toDate
    );

    res.render("allReleasedCalves", { calvesReleased, corrals });
  } catch (error) {
    console.log(error);
  }
});

router.get("/terneros-muertos", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    const userId = req.session.user._id;
    const search = req.query.search || "";
    const sortOrder = req.query.sort || "asc";
    const fromDate = req.query.fromDate || null;
    const toDate = req.query.toDate || null;

    const deadCalves = await calfManager.getDeadCalf(
      userId,
      search,
      sortOrder,
      fromDate,
      toDate
    );

    res.render("deadCalves", { deadCalves });
  } catch (error) {
    console.log(error);
  }
});

//ENFERMERY
router.get("/enfermeria", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    const userId = req.session.user._id;
    const treatments = await treatmentManager.getTreatments(userId);
    const calves = await calfManager.getCalves(userId);
    const corrals = await corralManager.getCorrals(userId);

    res.render("enfermery/enfermery", { treatments, calves, corrals });
  } catch (error) {
    console.log("Se ha producido un error", error);
  }
});

router.get(
  "/enfermeria/terneros-por-terminar-tratamiento",
  async (req, res) => {
    try {
      if (!req.session.login) {
        res.redirect("/");
        return;
      }
      userId = req.session.user._id;
      const now = moment.tz("America/Argentina/Buenos_Aires");

      const yesterday = now.clone().subtract(1, "days");
      const treatments = await treatmentManager.getTreatments(userId);
      const yesterdayCalves = await calfManager.getYesterdayCalves(
        userId,
        yesterday
      );
      const yesterdayCalvesWithContext = yesterdayCalves.map((calve) => ({
        ...calve,
        treatments: treatments,
      }));

      user = req.session.user;

      res.render("enfermery/finishing-calves", {
        user,
        yesterdayCalvesWithContext,
      });
    } catch (error) {
      console.log("Error de servidor", error);
    }
  }
);

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

router.get("/enfermeria/terneros-en-tratamiento", async (req, res) => {
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
    res.render("enfermery/treating-calves", {
      treatedCalves,
      user,
      corrals,
      notTreatedcalves,
    });
  } catch (error) {
    console.log("Error de servidor", error);
  }
});

router.get("/enfermeria/terneros-enfermeria", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    const userId = req.session.user._id;
    const search = req.query.search || "";
    const sortOrder = req.query.sort || "asc";

    const calves = await calfManager.getTreatedCalves(
      userId,
      search,
      sortOrder
    );
    

    res.render("enfermery/calvesEnfermery", { calves });
  } catch (error) {
    console.log(error);
  }
});

//STOPMILKING

router.get("/desleche", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    const owner = req.session.user._id;
    const protocol = await stopMilkingManager.getStopMilkingProtocol(owner);
    const stopMilkingCalves = await stopMilkingManager.getStopMilkingCalves(
      owner
    );

    res.render("stopMilking", { protocol, stopMilkingCalves });
  } catch (error) {
    console.log(error);
  }
});
router.get("/desleche-cargar", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }
    const owner = req.session.user._id;
    const protocol = await stopMilkingManager.getStopMilkingProtocol(owner);
    res.render("stopMilking-protocol", { protocol });
  } catch (error) {
    console.log(error);
  }
});

//Excel download

router.get("/descargar", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }

    const userId = req.session.user._id;
    const fromDate = req.query.fromDate || null;
    const toDate = req.query.toDate || null;

    console.log("Fechas recibidas:", { fromDate, toDate });

    const calves = await calfManager.getCalves(userId);
    const calvesBirth = await calfManager.getCalvesBirth(userId, fromDate, toDate);
    const calvesTreated = await calfManager.getCalvesTreated(userId, fromDate, toDate);
    const calvesReleased = await calfManager.getReleasedCalves(userId, null, null, fromDate, toDate);
    const deadCalves = await calfManager.getDeadCalf(userId, null, null, fromDate, toDate);


    res.render("excelDownload", { calves, calvesBirth, calvesTreated, calvesReleased, deadCalves, fromDate, toDate });
  } catch (error) {
    console.log("Error en /descargar:", error);
    res.status(500).send("Error al cargar la página de descarga");
  }
});




module.exports = router;
