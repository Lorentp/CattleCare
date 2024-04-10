const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");

router.post("/", async (req, res) => {
  const { username, password, farmname} = req.body;
  try {
    await UserModel.create({
      username,
      password,
      farmname,
      });
    res.send({ message: "Usuario creado correctamente" });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
