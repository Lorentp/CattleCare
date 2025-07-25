const express = require("express");
const moment = require("moment-timezone");
const app = express();
const momentMiddleware = require("./middleware/moment.js");
require("./database.js");

//ENV
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;
const mongo_url = process.env.MONGO_URL;
//Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("./src/public"));
app.use(momentMiddleware);
//Handlebars
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    getTreatment: function (treatment) {
      if (typeof treatment === "string" && treatment.trim() !== "") {
        try {
          const parsed = JSON.parse(treatment);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (typeof parsed[0] === "string") {
              return parsed[0];
            } else if (parsed[0].title) {
              return parsed[0].title;
            }
          }
          return treatment;
        } catch (e) {
          return treatment;
        }
      } else if (Array.isArray(treatment) && treatment.length > 0) {
        if (typeof treatment[0] === "string") {
          return treatment[0];
        } else if (treatment[0].title) {
          return treatment[0].title;
        }
      }
      return "Sin tratamiento";
    },
    contains: function (arrayString, item) {
      const array = JSON.parse(arrayString);
      return array.includes(item);
    },
    formatDate: function (date) {
      const today = moment()
        .tz("America/Argentina/Buenos_Aires")
        .startOf("day");
      const tomorrow = moment()
        .tz("America/Argentina/Buenos_Aires")
        .startOf("day")
        .add(1, "day");
      const formattedDate = moment()
        .tz("America/Argentina/Buenos_Aires")
        .locale("es")
        .format("LLLL");

      if (
        moment(date).tz("America/Argentina/Buenos_Aires").isSame(today, "day")
      ) {
        return (
          "Hoy, " +
          moment(date)
            .tz("America/Argentina/Buenos_Aires")
            .locale("es")
            .format("dddd, D [de] MMMM [de] YYYY")
        );
      } else if (
        moment(date)
          .tz("America/Argentina/Buenos_Aires")
          .isSame(tomorrow, "day")
      ) {
        return (
          "Mañana, " +
          moment(date)
            .tz("America/Argentina/Buenos_Aires")
            .locale("es")
            .format("dddd, D [de] MMMM [de] YYYY")
        );
      } else {
        return moment(date)
          .tz("America/Argentina/Buenos_Aires")
          .locale("es")
          .format("dddd, D [de] MMMM [de] YYYY");
      }
    },

    formatDateBirth: function (date) {
      return moment(date)
        .tz("America/Argentina/Buenos_Aires")
        .format("DD/MM/YYYY");
    },
    json: function (context) {
      return JSON.stringify(context);
    },
  },
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Sessions
const session = require("express-session");
const MongoStore = require("connect-mongo");
app.use(
  session({
    secret: "secretCalf",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongo_url,
      ttl: 9000,
    }),
  })
);

//Routes
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionsRouter = require("./routes/sessions.router.js");
const treatmentRouter = require("./routes/treatment.router.js");
const calfRouter = require("./routes/calf.router.js");
const corralRouter = require("./routes/corral.router.js");
const scheduleRouter = require("./routes/schedule.router.js");
const stopMilkingRouter = require("./routes/stopMilking.router.js");
const excelRouter = require("./routes/xlsx.router.js");
const swXlsRouter = require("./routes/swXls.router.js");
app.use("/", viewsRouter);
app.use("/register", userRouter);
app.use("/login", sessionsRouter);
app.use("/calf", calfRouter);
app.use("/treatment", treatmentRouter);
app.use("/corral", corralRouter);
app.use("/schedule", scheduleRouter);
app.use("/stopMilking", stopMilkingRouter);
app.use("/xlsx", excelRouter);
app.use("/swxls", swXlsRouter);

const httpServer = app.listen(port, () => {
  console.log(`Servidor testeando en el puerto ${port}`);
});
