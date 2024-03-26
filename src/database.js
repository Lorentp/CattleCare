const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://lorentp:jalnlorenza@cluster0.yyvof4b.mongodb.net/calfcare?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conexion a la base de datos exitosa"))
  .catch((error) =>
    console.log(
      "Ha ocurrido un error a la hora de conectar a la base de datos",
      error
    )
  );
