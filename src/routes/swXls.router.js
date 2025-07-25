const express = require("express");
const router = express.Router();

const ExcelSwManager = require("../dao/db/swXls-manager"); // Ajusta el path si es necesario
const excelSwManager = new ExcelSwManager();

router.post("/createSwExcel", async (req, res) => {
  try {
    const { calves } = req.body;

    const parsedCalves = JSON.parse(calves || "[]");

    const filePath = await excelSwManager.createSwExcel(parsedCalves);

    const fileName = `Sw_Animales.xls`;
    res.download(filePath, fileName);
  } catch (error) {
    console.error("Error en el endpoint:", error);
    res
      .status(500)
      .json({ error: "Error al generar el archivo Excel de Sw de Animales" });
  }
});

module.exports = router;
