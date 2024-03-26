const express = require("express");

const app = express();
const PORT = 3000;
require("./database.js");
//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Handlebars
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
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
      mongoUrl:
        "mongodb+srv://lorentp:jalnlorenza@cluster0.yyvof4b.mongodb.net/calfcare?retryWrites=true&w=majority&appName=Cluster0",
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
app.use("/", viewsRouter);
app.use("/register", userRouter);
app.use("/login", sessionsRouter);
app.use("/calf", calfRouter)
app.use("/treatment", treatmentRouter)

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor testeando en el puerto ${PORT}`);
});
