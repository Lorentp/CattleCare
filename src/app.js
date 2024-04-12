const express = require("express");
const moment = require("moment-timezone")
const app = express();

require("./database.js");


//ENV
const dotenv = require("dotenv")
dotenv.config()

const port = process.env.PORT
const mongo_url = process.env.MONGO_URL
//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"))

//Handlebars
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    formatDate: function(date) {
      
      const today = moment().startOf('day');
      const tomorrow = moment().startOf('day').add(1, 'day');
      const formattedDate = moment(date).locale('es').format('LLLL');
  
      if(moment(date).isSame(today, 'day')) {
        return "Hoy, " + moment(date).locale('es').format('dddd, D [de] MMMM [de] YYYY');
      } else if (moment(date).isSame(tomorrow, 'day')) {
        return "Mañana, " + moment(date).locale('es').format('dddd, D [de] MMMM [de] YYYY');
      } else {
        return moment(date).locale('es').format('dddd, D [de] MMMM [de] YYYY');
      }
    }
  }
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
      mongoUrl:
          mongo_url,
      ttl: 9000,
    }),
  })
);

//Routes
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionsRouter = require("./routes/sessions.router.js");
const treatmentRouter = require("./routes/treatment.router.js")
const calfRouter = require("./routes/calf.router.js")
const corralRouter = require("./routes/corral.router.js")
app.use("/", viewsRouter);
app.use("/register", userRouter);
app.use("/login", sessionsRouter);
app.use("/calf", calfRouter)
app.use("/treatment", treatmentRouter)
app.use("/corral", corralRouter)

const httpServer = app.listen(port, () => {
  console.log(`Servidor testeando en el puerto ${port}`);
});


