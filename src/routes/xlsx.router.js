const express = require("express");
const router = express.Router();

const ExcelManager = require("../dao/db/xlsx-manager.js");
const excelManager = new ExcelManager();

router.post("/createExcel", async (req, res) => {
  try {
    const { calves, calvesBirth, calvesTreated, calvesReleased, deadCalves, fromDate, toDate } = req.body;
    
    const user = req.session.user
    console.log("User en session:", user);

    if (!user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verificar si farmname está definido
    if (!user.farmname) {
      return res.status(400).json({ error: "El usuario no tiene un nombre de establecimiento definido" });
    }

    const parsedCalves = JSON.parse(calves || "[]");
    const parsedCalvesBirth = JSON.parse(calvesBirth || "[]");
    const parsedCalvesTreated = JSON.parse(calvesTreated || "[]");
    const parsedCalvesReleased = JSON.parse(calvesReleased || "[]");
    const parsedDeadCalves = JSON.parse(deadCalves || "[]");

    const formatDate = (dateStr) => {
      if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "sinFecha";
      const [year, month, day] = dateStr.split("-");
      if (!year || !month || !day || isNaN(parseInt(day)) || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
        return "sinFecha";
      }
      const formattedDay = day.padStart(2, "0");
      const formattedMonth = month.padStart(2, "0");
      const formattedYear = year.slice(-2);
      return `${formattedDay}-${formattedMonth}-${formattedYear}`;
    };

    const filePath = await excelManager.createExcel(
      parsedCalves,
      parsedCalvesBirth,
      parsedCalvesTreated,
      parsedCalvesReleased,
      parsedDeadCalves,
      fromDate,
      toDate,
      user
    );

    const fileName = `Resumen-guachera${user.farmname}_${formatDate(fromDate)}_al_${formatDate(toDate)}.xlsx`;
    res.download(filePath, fileName);
  } catch (error) {
    console.error("Error en el endpoint:", error);
    res.status(500).json({ error: "Error al generar el archivo Excel filtrado" });
  }
});

module.exports = router;
