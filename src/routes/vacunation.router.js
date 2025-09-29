const express = require("express");
const router = express.Router();

const VacunationManager = require("../dao/db/vacunation-manager");
const vacunationManager = new VacunationManager();

router.post("/add", async (req, res) => {
  try {
    const owner = req.session.user._id;
    const newVacunation = req.body;

    newVacunation.owner = owner;
    const result = await vacunationManager.addVacunation(newVacunation);

    if (result.success) {
      res.status(201).json(result);
    } else if (result.message.includes("ya existe")) {
      res.status(409).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete/:cid", async (req, res) => {
  try {
    const result = await vacunationManager.deleteVacunation(req.params.cid);
    if (result.success) {
      res.status(200).json(result);
    } else if (result.message.includes("No existe")) {
      res.status(404).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar protocolo" });
  }
});

module.exports = router;
