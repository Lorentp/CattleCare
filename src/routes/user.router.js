const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    await UserModel.create({
      username,
      password,
    });
    res.send({ message: "Usuario creado correctamente" });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
