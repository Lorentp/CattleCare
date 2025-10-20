const XlsxPopulate = require("xlsx-populate");
const moment = require("moment-timezone");
const VacunationModel = require("../models/vacunation.model");
const CalfModel = require("../models/calf.model"); // Asegúrate de que esta ruta sea correcta

class ExcelManager {
  constructor() {
    this.workbook = null;
  }

  // Función auxiliar para formatear fechas en DD-MM-YY (cambiado de / a - para evitar problemas en nombres de archivos)
  _formatDate(dateStr, fullYear = false) {
    if (!dateStr || !moment(dateStr).isValid()) return "Sin fecha";
    return moment(dateStr).format(fullYear ? "DD-MM-YYYY" : "DD-MM-YY");
  }

  // Función auxiliar para obtener lista de tratamientos como string
  _getTreatmentsList(treatments, includeDate = false) {
    if (!Array.isArray(treatments) || treatments.length === 0) return "";
    return treatments
      .map(t => {
        const title = t.title || "Sin título";
        const date = includeDate && t.startDate ? ` (${this._formatDate(t.startDate, true)})` : "";
        return `${title}${date}`;
      })
      .join("; ");
  }

  // Función auxiliar para obtener nombres únicos de tratamientos
  _getUniqueTreatments(calves) {
    const titles = calves.flatMap(calf => 
      (Array.isArray(calf.treatment) ? calf.treatment.map(t => t.title).filter(Boolean) : [])
    );
    return [...new Set(titles)];
  }

  // Función auxiliar para obtener nombre de tratamiento (para resúmenes)
  _getTreatmentName(treatments) {
    if (!Array.isArray(treatments) || treatments.length === 0) return "";
    return treatments.map(t => t.title || "").filter(Boolean).join("; ");
  }

  // Estilo para encabezados
  _styleHeaders(sheet, range, columns) {
    sheet.range(range).style({
      fill: { type: "solid", color: "FFFF00" },
      bold: true,
      border: { style: "thin", color: "000000" },
      horizontalAlignment: "center",
    });
    columns.forEach(({ col, width }) => sheet.column(col).width(width || 15));
  }

  // Estilo para bordes de filas
  _styleRowBorders(sheet, range) {
    sheet.range(range).style({
      border: { style: "thin", color: "000000" },
    });
  }

  // Crear tabla de porcentajes o conteos en resumen
  _createMetricsTable(sheet, title, startCol, startRow, metrics) {
    const valueCol = String.fromCharCode(startCol.charCodeAt(0) + 1);
    sheet.cell(`${startCol}${startRow}`).value(title).style({ bold: true });
    sheet.cell(`${startCol}${startRow + 1}`).value("Métrica");
    sheet.cell(`${valueCol}${startRow + 1}`).value("Valor");
    this._styleHeaders(sheet, `${startCol}${startRow + 1}:${valueCol}${startRow + 1}`, [
      { col: startCol, width: 25 },
      { col: valueCol, width: 15 },
    ]);

    metrics.forEach((metric, index) => {
      const row = startRow + 2 + index;
      sheet.cell(`${startCol}${row}`).value(metric.label);
      sheet.cell(`${valueCol}${row}`).formula(metric.formula).style("numberFormat", metric.format || "0");
      this._styleRowBorders(sheet, `${startCol}${row}:${valueCol}${row}`);
    });
  }

  // Configuración general de hoja
  _setupSheet(sheet, title, countLabel, count, footerText, filterText) {
    sheet.cell("B2").value(title).style({ bold: true, fontSize: 14 });
    if (countLabel) sheet.cell("B3").value(countLabel).style({ bold: true });
    if (count) sheet.cell("C3").value(count);
    sheet.cell("I2").value(footerText);
    if (filterText) sheet.cell("K2").value(filterText);
    sheet.freezePanes(1, 1); // Congelar primera fila
  }

// Hoja de Resumen
  async _createSummarySheet(fromDate, toDate, deadCalves, calvesBirth, calvesReleased, calvesTreated, user) {
    const sheet = this.workbook.sheet(0).name("Resumen");
    const filterText = `Período: ${this._formatDate(fromDate, true)} a ${this._formatDate(toDate, true)}`;
    this._setupSheet(sheet, "Resumen de Terneros", null, null, "Archivo generado por TERNTECH || Contacto: 3534270126", filterText);
    sheet.cell("B4").value(user.farmname || "Establecimiento").style({ bold: true });

    // Filtrar datos por período
    const start = moment(fromDate).startOf("day");
    const end = moment(toDate).endOf("day");

    const filteredBirths = calvesBirth.filter(c => moment(c.birthDate).isBetween(start, end));
    const filteredDead = deadCalves.filter(c => moment(c.timeDead).isBetween(start, end));
    const filteredReleased = calvesReleased.filter(c => moment(c.whenReleased).isBetween(start, end));
    const filteredTreated = calvesTreated.filter(c => moment(c.startDate).isBetween(start, end));

    // Métricas de Nacimientos
    const birthMetrics = [
      { label: "Total Nacimientos", formula: "=COUNTA(Nacimientos!B5:B1048576)", format: "0" },
      { label: "Machos", formula: '=COUNTIF(Nacimientos!C5:C1048576, "Macho")', format: "0" },
      { label: "Hembras", formula: '=COUNTIF(Nacimientos!C5:C1048576, "Hembra")', format: "0" },
      { label: "Parto Normal", formula: '=COUNTIF(Nacimientos!H5:H1048576, "1-Normal")', format: "0" },
      { label: "Parto Asistido", formula: '=COUNTIF(Nacimientos!H5:H1048576, "2-Asistido")', format: "0" },
      { label: "Parto Cesárea", formula: '=COUNTIF(Nacimientos!H5:H1048576, "3-Cesárea")', format: "0" },

    ];
    this._createMetricsTable(sheet, "Resumen de Nacimientos", "B", 5, birthMetrics);

    // Métricas de Muertes
    const deadTreatments = this._getUniqueTreatments(filteredDead);
    const deadMetrics = [
      { label: "Total Muertos", formula: "=COUNTA(Muertes!B5:B1048576)", format: "0" },
      { label: "Machos", formula: '=COUNTIF(Muertes!C5:C1048576, "Macho")', format: "0" },
      { label: "Hembras", formula: '=COUNTIF(Muertes!C5:C1048576, "Hembra")', format: "0" },
      { label: "Parto Normal", formula: '=COUNTIF(Muertes!D5:D1048576, "1-Normal")', format: "0" },
      { label: "Parto Asistido", formula: '=COUNTIF(Muertes!D5:D1048576, "2-Asistido")', format: "0" },
      { label: "Parto Cesárea", formula: '=COUNTIF(Muertes!D5:D1048576, "3-Cesárea")', format: "0" },
      { label: "Edad 0-3 días", formula: '=COUNTIFS(Muertes!G5:G1048576, ">=0", Muertes!G5:G1048576, "<=3")', format: "0" },
      { label: "Edad 4-7 días", formula: '=COUNTIFS(Muertes!G5:G1048576, ">3", Muertes!G5:G1048576, "<=7")', format: "0" },
      { label: "Edad 8-14 días", formula: '=COUNTIFS(Muertes!G5:G1048576, ">7", Muertes!G5:G1048576, "<=14")', format: "0" },
      { label: "Edad +14 días", formula: '=COUNTIF(Muertes!G5:G1048576, ">14")', format: "0" },
      ...deadTreatments.map(t => ({
        label: `Tratamiento: ${t}`,
        formula: `=COUNTIF(Muertes!I5:I1048576, "*${t}*")`,
        format: "0"
      })),
    ];
    this._createMetricsTable(sheet, "Resumen de Muertes", "E", 5, deadMetrics);

    // Métricas de Tratados
    const treatedTreatments = this._getUniqueTreatments(filteredTreated);
    const treatedMetrics = [
      { label: "Total Tratados", formula: "=COUNTA(Tratados!B5:B1048576)", format: "0" },
      { label: "Machos", formula: '=COUNTIF(Tratados!C5:C1048576, "Macho")', format: "0" },
      { label: "Hembras", formula: '=COUNTIF(Tratados!C5:C1048576, "Hembra")', format: "0" },
      ...treatedTreatments.map(t => ({
        label: `Tratamiento: ${t}`,
        formula: `=COUNTIF(Tratados!H5:H1048576, "*${t}*")`,
        format: "0"
      })),
    ];
    this._createMetricsTable(sheet, "Resumen de Tratados", "I", 5, treatedMetrics);

    // Métricas de Largados
    const releasedMetrics = [
      { label: "Total Largados", formula: "=COUNTA(Largados!B5:B1048576)", format: "0" },
      { label: "Machos", formula: '=COUNTIF(Largados!C5:C1048576, "Macho")', format: "0" },
      { label: "Hembras", formula: '=COUNTIF(Largados!C5:C1048576, "Hembra")', format: "0" },
      { label: "Promedio Días en Guachera", formula: "=AVERAGE(Largados!H5:H1048576)", format: "0" },
      { label: "Promedio Peso", formula: "=AVERAGE(Largados!I5:I1048576)", format: "0.00" },
      { label: "Promedio Kilos Ganados", formula: "=AVERAGE(Largados!J5:J1048576)", format: "0.00" },
      { label: "Promedio Aumento/Día", formula: "M12/M10", format: "0.000" },
    ];
    this._createMetricsTable(sheet, "Resumen de Largados", "L", 5, releasedMetrics);
  }

  // Hoja de Guachera (Terneros actuales)
  _createGuacheraSheet(calves) {
    const sheet = this.workbook.addSheet("Guachera");
    const headers = ["Caravana", "Sexo", "Fecha Nacimiento", "Peso Nacimiento", "Calostro"];
    const columns = headers.map((_, i) => ({ col: String.fromCharCode(66 + i), width: i === headers.length - 1 ? 50 : 15 }));
    this._setupSheet(sheet, "Terneros en Guachera", "Cantidad:", calves.length, "Archivo generado por TERNTECH");
    headers.forEach((h, i) => sheet.cell(`${String.fromCharCode(66 + i)}4`).value(h));
    this._styleHeaders(sheet, `B4:${String.fromCharCode(66 + headers.length - 1)}4`, columns);

    calves.sort((a, b) => a.name.localeCompare(b.name)); // Ordenar por caravana
    calves.forEach((calf, index) => {
      const row = 5 + index;
      sheet.cell(`B${row}`).value(calf.name);
      sheet.cell(`C${row}`).value(calf.gender);
      sheet.cell(`D${row}`).value(this._formatDate(calf.birthDate, true));
      sheet.cell(`E${row}`).value(calf.calfWeight);
      sheet.cell(`F${row}`).value(calf.calfCalostro);
      this._styleRowBorders(sheet, `B${row}:F${row}`);
    });
  }

  // Hoja de Nacimientos
  _createBirthSheet(calvesBirth, fromDate, toDate) {
    const sheet = this.workbook.addSheet("Nacimientos");
    const headers = ["Caravana", "Sexo", "Fecha Nacimiento", "Peso", "Calostro", "Madre", "Tipo Parto"];
    const columns = headers.map((_, i) => ({ col: String.fromCharCode(66 + i), width: 15 }));
    const filterText = `Período: ${this._formatDate(fromDate, true)} a ${this._formatDate(toDate, true)}`;
    this._setupSheet(sheet, "Nacimientos", "Cantidad:", calvesBirth.length, "Archivo generado por TERNTECH", filterText);
    headers.forEach((h, i) => sheet.cell(`${String.fromCharCode(66 + i)}4`).value(h));
    this._styleHeaders(sheet, `B4:${String.fromCharCode(66 + headers.length - 1)}4`, columns);

    calvesBirth.sort((a, b) => moment(a.birthDate).diff(moment(b.birthDate)));
    calvesBirth.forEach((calf, index) => {
      const row = 5 + index;
      sheet.cell(`B${row}`).value(calf.name);
      sheet.cell(`C${row}`).value(calf.gender);
      sheet.cell(`D${row}`).value(this._formatDate(calf.birthDate, true));
      sheet.cell(`E${row}`).value(calf.calfWeight);
      sheet.cell(`F${row}`).value(calf.calfCalostro);
      sheet.cell(`G${row}`).value(calf.mother);
      sheet.cell(`H${row}`).value(calf.birthType);
      this._styleRowBorders(sheet, `B${row}:H${row}`);
    });
  }

  // Hoja de Muertos
  _createDeadSheet(deadCalves, fromDate, toDate) {
    const sheet = this.workbook.addSheet("Muertes");
    const headers = ["Caravana", "Sexo", "Tipo Parto", "Fecha Nacimiento", "Fecha Muerte", "Edad de muerte (dias)", "Peso Nacimiento", "Tratamientos", "Comentario"];
    const columns = headers.map((_, i) => ({ col: String.fromCharCode(66 + i), width: i === 7 ? 50 : 15 }));
    const filterText = `Período: ${this._formatDate(fromDate, true)} a ${this._formatDate(toDate, true)}`;
    this._setupSheet(sheet, "Terneros Muertos", "Cantidad:", deadCalves.length, "Archivo generado por TERNTECH", filterText);
    headers.forEach((h, i) => sheet.cell(`${String.fromCharCode(66 + i)}4`).value(h));
    this._styleHeaders(sheet, `B4:${String.fromCharCode(66 + headers.length - 1)}4`, columns);

    deadCalves.sort((a, b) => moment(a.timeDead).diff(moment(b.timeDead)));
    deadCalves.forEach((calf, index) => {
      const row = 5 + index;
      sheet.cell(`B${row}`).value(calf.name);
      sheet.cell(`C${row}`).value(calf.gender);
      sheet.cell(`D${row}`).value(calf.birthType);
      sheet.cell(`E${row}`).value(this._formatDate(calf.birthDate, true));
      sheet.cell(`F${row}`).value(this._formatDate(calf.timeDead, true));
      sheet.cell(`G${row}`).value(calf.daysInGuachera || moment(calf.timeDead).diff(moment(calf.birthDate), "days"));
      sheet.cell(`H${row}`).value(calf.calfWeight);
      sheet.cell(`I${row}`).value(this._getTreatmentsList(calf.treatment, true));
      sheet.cell(`J${row}`).value(calf.comment);
      this._styleRowBorders(sheet, `B${row}:J${row}`);
    });
  }

  // Hoja de Tratados
  _createTreatedSheet(calvesTreated, fromDate, toDate) {
    const sheet = this.workbook.addSheet("Tratados");
    const headers = ["Caravana", "Sexo", "Fecha Nacimiento", "Peso Nacimiento", "Calostro", "Tratamientos"];
    const columns = headers.map((_, i) => ({ col: String.fromCharCode(66 + i), width: i === 6 ? 50 : 15 }));
    const filterText = `Período: ${this._formatDate(fromDate, true)} a ${this._formatDate(toDate, true)}`;
    this._setupSheet(sheet, "Terneros Tratados", "Cantidad:", calvesTreated.length, "Archivo generado por TERNTECH", filterText);
    headers.forEach((h, i) => sheet.cell(`${String.fromCharCode(66 + i)}4`).value(h));
    this._styleHeaders(sheet, `B4:${String.fromCharCode(66 + headers.length - 1)}4`, columns);

    calvesTreated.forEach((calf, index) => {
      const row = 5 + index;
      sheet.cell(`B${row}`).value(calf.name);
      sheet.cell(`C${row}`).value(calf.gender);
      sheet.cell(`D${row}`).value(this._formatDate(calf.birthDate, true));
      sheet.cell(`E${row}`).value(calf.calfWeight);
      sheet.cell(`F${row}`).value(calf.calfCalostro);
      sheet.cell(`G${row}`).value(this._getTreatmentsList(calf.treatment, true));
      this._styleRowBorders(sheet, `B${row}:G${row}`);
    });
  }

  // Hoja de Largados (Liberados)
  _createReleasedSheet(calvesReleased, fromDate, toDate) {
    const sheet = this.workbook.addSheet("Largados");
    const headers = ["Caravana", "Sexo", "Fecha Nacimiento", "Peso Inicial", "Calostro", "Fecha Largado", "Días Guachera", "Peso Final", "Kilos Ganados", "Aumento/Día", "Tratamientos"];
    const columns = headers.map((_, i) => ({ col: String.fromCharCode(66 + i), width: i === headers.length - 1 ? 50 : 15 }));
    const filterText = `Período: ${this._formatDate(fromDate, true)} a ${this._formatDate(toDate, true)}`;
    this._setupSheet(sheet, "Terneros Liberados", "Cantidad:", calvesReleased.length, "Archivo generado por TERNTECH", filterText);
    headers.forEach((h, i) => sheet.cell(`${String.fromCharCode(66 + i)}4`).value(h));
    this._styleHeaders(sheet, `B4:${String.fromCharCode(66 + headers.length - 1)}4`, columns);

    calvesReleased.forEach((calf, index) => {
      const row = 5 + index;
      const initialWeight = Number(calf.calfWeight) || 0;
      const finalWeight = Number(calf.releasedWeight) || 0;
      const weightGain = finalWeight - initialWeight;
      const days = calf.daysInGuachera || 0;
      const gainPerDay = days > 0 ? (weightGain / days).toFixed(3) : "";

      sheet.cell(`B${row}`).value(calf.name);
      sheet.cell(`C${row}`).value(calf.gender);
      sheet.cell(`D${row}`).value(this._formatDate(calf.birthDate, true));
      sheet.cell(`E${row}`).value(initialWeight);
      sheet.cell(`F${row}`).value(calf.calfCalostro);
      sheet.cell(`G${row}`).value(this._formatDate(calf.whenReleased, true));
      sheet.cell(`H${row}`).value(days);
      sheet.cell(`I${row}`).value(finalWeight);
      sheet.cell(`J${row}`).value(weightGain);
      sheet.cell(`K${row}`).value(gainPerDay);
      sheet.cell(`L${row}`).value(this._getTreatmentsList(calf.treatment, true));
      this._styleRowBorders(sheet, `B${row}:L${row}`);
    });
  }

  // Hoja de Vacunaciones
  async _createVaccinationsSheet(allCalves, fromDate, toDate, user) {
    const sheet = this.workbook.addSheet("Vacunaciones");
    const protocols = await VacunationModel.find({ owner: user._id }).sort({ name: 1 });
    const headers = ["Caravana", ...protocols.map(p => p.name)];
    const columns = headers.map((_, i) => ({ col: String.fromCharCode(66 + i), width: 20 }));
    const filterText = `Período: ${this._formatDate(fromDate, true)} a ${this._formatDate(toDate, true)}`;
    this._setupSheet(sheet, "Vacunaciones Realizadas", "Cantidad:", 0, "Archivo generado por TERNTECH", filterText);
    headers.forEach((h, i) => sheet.cell(`${String.fromCharCode(66 + i)}4`).value(h));
    const lastCol = String.fromCharCode(66 + headers.length - 1);
    this._styleHeaders(sheet, `B4:${lastCol}4`, columns);

    const start = moment(fromDate).startOf("day");
    const end = moment(toDate).endOf("day");
    let vacCount = 0;

    allCalves.sort((a, b) => a.name.localeCompare(b.name));
    allCalves.forEach((calf, index) => {
      const row = 5 + index;
      sheet.cell(`B${row}`).value(calf.name);

      protocols.forEach((proto, protoIndex) => {
        const col = String.fromCharCode(67 + protoIndex);
        const vacs = (calf.vacunation || []).filter(v => 
          v.protocolId.toString() === proto._id.toString() && 
          moment(v.date).isBetween(start, end)
        );
        if (vacs.length > 0) {
          const dates = vacs.map(v => this._formatDate(v.date, true)).join("; ");
          sheet.cell(`${col}${row}`).value(dates);
          vacCount += vacs.length;
        } else {
          sheet.cell(`${col}${row}`).value("X");
        }
      });
      this._styleRowBorders(sheet, `B${row}:${lastCol}${row}`);
    });

    sheet.cell("C3").value(vacCount); // Actualizar conteo total
  }

  // Método principal para crear Excel
  async createExcel(calves, calvesBirth, calvesTreated, calvesReleased, deadCalves, fromDate, toDate, user) {
    try {
      this.workbook = await XlsxPopulate.fromBlankAsync();

      // Recopilar todos los terneros únicos
      const allCalvesMap = new Map();
      [calves, calvesBirth, calvesTreated, calvesReleased, deadCalves].forEach(list => 
        list.forEach(c => allCalvesMap.set(c._id.toString(), c))
      );
      const allCalves = Array.from(allCalvesMap.values());

      // Crear hojas
      await this._createSummarySheet(fromDate, toDate, deadCalves, calvesBirth, calvesReleased, calvesTreated, user);
      this._createGuacheraSheet(calves);
      this._createBirthSheet(calvesBirth, fromDate, toDate);
      this._createDeadSheet(deadCalves, fromDate, toDate);
      this._createTreatedSheet(calvesTreated, fromDate, toDate);
      this._createReleasedSheet(calvesReleased, fromDate, toDate);
      await this._createVaccinationsSheet(allCalves, fromDate, toDate, user);

      const fileName = `ResumenTerneros_${user.farmname || "General"}_${this._formatDate(fromDate)}_al_${this._formatDate(toDate)}.xlsx`;
      const filePath = `./${fileName}`;
      await this.workbook.toFileAsync(filePath);
      return filePath;
    } catch (error) {
      console.error("Error generando Excel:", error);
      throw new Error("Error al generar el archivo Excel");
    }
  }
}

module.exports = ExcelManager;