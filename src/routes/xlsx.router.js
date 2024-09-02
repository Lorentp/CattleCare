const express = require("express");
const router = express.Router();

const ExcelManager = require("../dao/db/xlsx-manager.js");
const excelManager = new ExcelManager();

router.post("/create", async (req, res) => {
  try {
    const calves = JSON.parse(req.body.calves);
    const filePath = await excelManager.createExcelAllCalves(calves);
    res.download(filePath, "terneros.xlsx");
  } catch (error) {
    console.log(error);
  }
});

router.post("/createReleased", async (req, res) => {
  try {
    const calvesReleased = JSON.parse(req.body.calvesReleased);
    const filePath = await excelManager.createExcelReleasedCalves(
      calvesReleased
    );
    res.download(filePath, "ternerosLargados.xlsx");
  } catch (error) {
    console.log(error);
  }
});

router.post("/createDead", async (req, res) => {
  try {
    const deadCalves = JSON.parse(req.body.deadCalves);
    const filePath = await excelManager.createExcelDeadCalves(deadCalves);
    res.download(filePath, "ternerosMuertos.xlsx");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
