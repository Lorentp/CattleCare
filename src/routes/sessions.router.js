const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (user.password === password) {
      req.session.login = true;
      req.session.user = user
      res.redirect("/home");
    } else {
      res.send({ message: "contrasena incorrecta" });
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/logout", async (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/")
});

module.exports = router;
