const express = require("express");

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
      const formatOptions =  {weekday:"long", day:"numeric", month:"long", year: "numeric"}
      const formatDate = new Date(date)
      const correctDate = formatDate.setDate(formatDate.getDate() + 1)
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)

      if(formatDate.toDateString() === today.toDateString()){
        return "Hoy, " + new Date(correctDate).toLocaleDateString('es-AR', formatOptions);
      }
      else if (formatDate.toDateString() === tomorrow.toDateString()) {
        return "Mañana, " + new Date(correctDate).toLocaleDateString('es-AR', formatOptions);
      } else {
        return formatDate.toLocaleDateString("es-AR", formatOptions)
      }
    },
   
    
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


