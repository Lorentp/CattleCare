const XlsxPopulate = require("xlsx-populate");
const moment = require("moment-timezone");

class ExcelManager {
  /**
   * @param {string} dateStr
   * @returns {string}
   */
  _formatFilterDate(dateStr) {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "Sin fecha";
    const [year, month, day] = dateStr.split("-");
    if (
      !year ||
      !month ||
      !day ||
      isNaN(parseInt(day)) ||
      isNaN(parseInt(month)) ||
      isNaN(parseInt(year))
    ) {
      return "Sin fecha";
    }
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year.slice(
      -2
    )}`;
  }

  /**
   * @param {string|Array|Object} treatment
   * @returns {string}
   */
  _getTreatmentName(treatment) {
    if (typeof treatment === "string") return treatment;
    if (Array.isArray(treatment) && treatment.length > 0) {
      const treatmentItem = treatment[0];
      if (typeof treatmentItem === "string") return treatmentItem;
      if (
        treatmentItem &&
        typeof treatmentItem === "object" &&
        treatmentItem.title
      ) {
        return treatmentItem.title;
      }
    }
    return "";
  }

  /**
   * @param {Object} sheet
   * @param {string} range
   * @param {Array} columns
   */
  _styleHeaders(sheet, range, columns) {
    sheet.range(range).style({
      fill: { type: "solid", color: "FFFF00" },
      border: {
        top: { style: "thick", color: "000000" },
        bottom: { style: "thick", color: "000000" },
        left: { style: "thick", color: "000000" },
        right: { style: "thick", color: "000000" },
      },
    });
    columns.forEach(({ col, width }) => sheet.column(col).width(width));
  }

  /**
   * @param {Object} sheet
   * @param {string} range
   */
  _styleRowBorders(sheet, range) {
    sheet.range(range).style({
      border: {
        bottom: { style: "thin", color: "000000" },
        left: { style: "thin", color: "000000" },
        right: { style: "thin", color: "000000" },
      },
    });
  }

  /**
   * @param {Object} sheet
   * @param {string} title
   * @param {string} startCol
   * @param {number} startRow
   * @param {Array} metrics
   */
  _createPercentageTable(sheet, title, startCol, startRow, metrics) {
    const valueCol = String.fromCharCode(startCol.charCodeAt(0) + 1);
    sheet.cell(`${startCol}${startRow}`).value(title).style({ bold: true });
    sheet.cell(`${startCol}${startRow + 2}`).value("Métrica");
    sheet.cell(`${valueCol}${startRow + 2}`).value("Porcentaje");

    this._styleHeaders(
      sheet,
      `${startCol}${startRow + 2}:${valueCol}${startRow + 2}`,
      [
        { col: startCol, width: 25 },
        { col: valueCol, width: 15 },
      ]
    );

    metrics.forEach((metric, index) => {
      const row = startRow + 3 + index;
      sheet.cell(`${startCol}${row}`).value(metric.label);
      sheet
        .cell(`${valueCol}${row}`)
        .formula(metric.formula)
        .style("numberFormat", "0.00%");
      this._styleRowBorders(sheet, `${startCol}${row}:${valueCol}${row}`);
    });

    return startRow + 3 + metrics.length;
  }

  /**
   * @param {Object} sheet
   * @param {string} countLabel
   * @param {number} count
   * @param {string} headerRange
   * @param {Array} columns
   * @param {Array} headers
   * @param {string} [footerCol="I"]
   * @param {string} [filterText]
   */
  _setupSheet(
    sheet,
    countLabel,
    count,
    headerRange,
    columns,
    headers,
    footerCol = "I",
    filterText
  ) {
    sheet.cell("B2").value(countLabel);
    sheet.cell("C2").value(count);
    sheet
      .cell(`${footerCol}2`)
      .value("Este archivo generado por TERNTECH || Contacto: 3534270126");
    if (filterText)
      sheet.cell(`${footerCol === "I" ? "K" : "M"}2`).value(filterText);

    sheet.freezePanes(0, 4);
    headers.forEach((header, index) => {
      sheet.cell(`${String.fromCharCode(66 + index)}4`).value(header);
    });

    this._styleHeaders(sheet, headerRange, columns);
  }

  /**
   * @param {Object} workbook
   * @param {string} fromDate
   * @param {string} toDate
   * @param {Array} deadCalves
   * @param {Array} calvesBirth
   * @param {Array} calvesReleased
   * @param {Array} calvesTreated
   */
  _createSummarySheet(
    workbook,
    fromDate,
    toDate,
    deadCalves,
    calvesBirth,
    calvesReleased,
    calvesTreated
  ) {
    const summarySheet = workbook.sheet(0).name("Resumen");

    // Title and period
    summarySheet
      .cell("B2")
      .value("Resumen de Terneros")
      .style({ bold: true, fontSize: 14 });
    summarySheet
      .cell("B3")
      .value(
        `Período: ${this._formatFilterDate(
          fromDate
        )} a ${this._formatFilterDate(toDate)}`
      )
      .style({ italic: true });
    summarySheet
      .cell("I2")
      .value("Este archivo generado por TERNTECH || Contacto: 3534270126");

    // Births table (B-C)
    summarySheet
      .cell("B5")
      .value("Resumen de Nacimientos")
      .style({ bold: true });
    const birthMetrics = [
      { label: "Total Nacidos", formula: "=COUNTA(Nacimientos!B5:B1048576)" },
      {
        label: "Machos",
        formula: '=COUNTIF(Nacimientos!C5:C1048576, "Macho")',
      },
      {
        label: "Hembras",
        formula: '=COUNTIF(Nacimientos!C5:C1048576, "Hembra")',
      },
      {
        label: "Parto Normal",
        formula: '=COUNTIF(Nacimientos!D5:D1048576, "1-Normal")',
      },
      {
        label: "Parto Asistido",
        formula: '=COUNTIF(Nacimientos!D5:D1048576, "2-Asistido")',
      },
      {
        label: "Parto Cesárea",
        formula: '=COUNTIF(Nacimientos!D5:D1048576, "3-Cesárea")',
      },
    ];
    this._styleHeaders(summarySheet, "B7:C7", [
      { col: "B", width: 25 },
      { col: "C", width: 15 },
    ]);
    birthMetrics.forEach((metric, index) => {
      const row = 8 + index;
      summarySheet.cell(`B${row}`).value(metric.label);
      summarySheet
        .cell(`C${row}`)
        .formula(metric.formula)
        .style("numberFormat", "0");
      this._styleRowBorders(summarySheet, `B${row}:C${row}`);
    });

    // Deaths table (E-F)
    summarySheet.cell("E5").value("Resumen de Muertes").style({ bold: true });
    const deadCalvesFiltered =
      deadCalves && Array.isArray(deadCalves)
        ? deadCalves.filter((calf) => calf.isDead)
        : [];
    const deadTreatments = [
      ...new Set(
        deadCalvesFiltered
          .map((calf) => this._getTreatmentName(calf.treatment))
          .filter((t) => t)
      ),
    ];
    const deadMetrics = [
      { label: "Total Muertos", formula: "=COUNTA(Muertes!B5:B1048576)" },
      { label: "Machos", formula: '=COUNTIF(Muertes!C5:C1048576, "Macho")' },
      { label: "Hembras", formula: '=COUNTIF(Muertes!C5:C1048576, "Hembra")' },
      {
        label: "Parto Normal",
        formula: '=COUNTIF(Muertes!D5:D1048576, "1-Normal")',
      },
      {
        label: "Parto Asistido",
        formula: '=COUNTIF(Muertes!D5:D1048576, "2-Asistido")',
      },
      {
        label: "Parto Cesárea",
        formula: '=COUNTIF(Muertes!D5:D1048576, "3-Cesárea")',
      },
      {
        label: "Edad 0-10 días",
        formula:
          '=COUNTIFS(Muertes!L5:L1048576, ">=0", Muertes!L5:L1048576, "<=10")',
      },
      {
        label: "Edad 11-20 días",
        formula:
          '=COUNTIFS(Muertes!L5:L1048576, ">10", Muertes!L5:L1048576, "<=20")',
      },
      {
        label: "Edad 21-30 días",
        formula:
          '=COUNTIFS(Muertes!L5:L1048576, ">20", Muertes!L5:L1048576, "<=30")',
      },
      {
        label: "Edad +31 días",
        formula: '=COUNTIF(Muertes!L5:L1048576, ">30")',
      },
      ...deadTreatments.map((treatment) => ({
        label: `Tratamiento: ${treatment}`,
        formula: `=COUNTIF(Muertes!H5:H1048576, "${treatment}")`,
      })),
    ];
    this._styleHeaders(summarySheet, "E7:F7", [
      { col: "E", width: 25 },
      { col: "F", width: 15 },
    ]);
    deadMetrics.forEach((metric, index) => {
      const row = 8 + index;
      summarySheet.cell(`E${row}`).value(metric.label);
      summarySheet
        .cell(`F${row}`)
        .formula(metric.formula)
        .style("numberFormat", "0");
      this._styleRowBorders(summarySheet, `E${row}:F${row}`);
    });

    // Released calves table (H-I)
    summarySheet
      .cell("H5")
      .value("Resumen de Terneros Largados")
      .style({ bold: true });
    const releasedMetrics = [
      { label: "Total Largados", formula: "=COUNTA(Largados!B5:B1048576)" },
      { label: "Machos", formula: '=COUNTIF(Largados!C5:C1048576, "Macho")' },
      { label: "Hembras", formula: '=COUNTIF(Largados!C5:C1048576, "Hembra")' },
      {
        label: "Días en Guachera (Promedio)",
        formula: "=AVERAGE(Largados!G5:G1048576)",
      },
      {
        label: "Peso al Nacimiento (Promedio)",
        formula: '=AVERAGEIF(Largados!H5:H1048576, ">0")',
      },
      {
        label: "Peso al Ser Largado (Promedio)",
        formula: '=AVERAGEIF(Largados!I5:I1048576, ">0")',
      },
      {
        label: "Aumento por Día (Promedio)",
        formula: '=AVERAGEIF(Largados!K5:K1048576, ">0")',
      },
    ];
    this._styleHeaders(summarySheet, "H7:I7", [
      { col: "H", width: 25 },
      { col: "I", width: 15 },
    ]);
    releasedMetrics.forEach((metric, index) => {
      const row = 8 + index;
      summarySheet.cell(`H${row}`).value(metric.label);
      summarySheet
        .cell(`I${row}`)
        .formula(metric.formula)
        .style("numberFormat", index >= 3 ? "0.00" : "0");
      this._styleRowBorders(summarySheet, `H${row}:I${row}`);
    });

    // Treated calves table (K-L)
    summarySheet
      .cell("K5")
      .value("Resumen de Terneros Tratados")
      .style({ bold: true });
    const treatedCalvesFiltered =
      calvesTreated && Array.isArray(calvesTreated) ? calvesTreated : [];
    const treatedTreatments = [
      ...new Set(
        treatedCalvesFiltered
          .map((calf) => this._getTreatmentName(calf.treatment))
          .filter((t) => t)
      ),
    ];
    const treatedMetrics = [
      { label: "Total Tratados", formula: "=COUNTA(Tratados!B5:B1048576)" },
      {
        label: "Parto Normal",
        formula: '=COUNTIF(Tratados!D5:D1048576, "1-Normal")',
      },
      {
        label: "Parto Asistido",
        formula: '=COUNTIF(Tratados!D5:D1048576, "2-Asistido")',
      },
      {
        label: "Parto Cesárea",
        formula: '=COUNTIF(Tratados!D5:D1048576, "3-Cesárea")',
      },
      ...treatedTreatments.map((treatment) => ({
        label: `Tratamiento: ${treatment}`,
        formula: `=COUNTIF(Tratados!G5:G1048576, "${treatment}")`,
      })),
    ];
    this._styleHeaders(summarySheet, "K7:L7", [
      { col: "K", width: 25 },
      { col: "L", width: 15 },
    ]);
    treatedMetrics.forEach((metric, index) => {
      const row = 8 + index;
      summarySheet.cell(`K${row}`).value(metric.label);
      summarySheet
        .cell(`L${row}`)
        .formula(metric.formula)
        .style("numberFormat", "0");
      this._styleRowBorders(summarySheet, `K${row}:L${row}`);
    });

    // Calculate starting row for percentage tables
    const startRowPercentages =
      Math.max(
        8 + birthMetrics.length,
        8 + deadMetrics.length,
        8 + releasedMetrics.length,
        8 + treatedMetrics.length
      ) + 3;

    // Table 1: Sex percentages (B-C)
    this._createPercentageTable(
      summarySheet,
      "Porcentaje de Sexo (Nacidos)",
      "B",
      startRowPercentages,
      [
        { label: "Machos", formula: "=IF(C8=0, 0, C9/C8)" },
        { label: "Hembras", formula: "=IF(C8=0, 0, C10/C8)" },
      ]
    );

    // Table 2: Birth type percentages (E-F)
    this._createPercentageTable(
      summarySheet,
      "Porcentaje de Tipos de Parto (Nacidos)",
      "E",
      startRowPercentages,
      [
        { label: "Parto Normal", formula: "=IF(C8=0, 0, C11/C8)" },
        { label: "Parto Asistido", formula: "=IF(C8=0, 0, C12/C8)" },
        { label: "Parto Cesárea", formula: "=IF(C8=0, 0, C13/C8)" },
      ]
    );

    // Table 3: Dead treatment percentages (H-I)
    const deadTreatmentPercentMetrics = deadTreatments.map(
      (treatment, index) => ({
        label: `Tratamiento: ${treatment}`,
        formula: `=IF(F8=0, 0, F${18 + index}/F8)`,
      })
    );
    const deadTreatmentEndRow = this._createPercentageTable(
      summarySheet,
      "Porcentaje de Tratamientos (Muertos)",
      "H",
      startRowPercentages,
      deadTreatmentPercentMetrics
    );

    // Table 4: Outcome percentages (K-L)
    this._createPercentageTable(
      summarySheet,
      "Porcentaje de Largados y Muertos",
      "K",
      startRowPercentages,
      [
        { label: "Largados", formula: "=IF((I8+F8)=0, 0, I8/(I8+F8))" },
        { label: "Muertos", formula: "=IF((I8+F8)=0, 0, F8/(I8+F8))" },
      ]
    );

    // Table 5: Treated treatment percentages (N-O)
    this._createPercentageTable(
      summarySheet,
      "Porcentaje de Tratamientos (Tratados)",
      "N",
      startRowPercentages,
      treatedTreatments.map((treatment) => ({
        label: `Tratamiento: ${treatment}`,
        formula: `=IF(L8=0, 0, (COUNTIF(Tratados!G5:G1048576, "${treatment}")/L8))`,
      }))
    );

    // Table 6: Age at death percentages (H-I, below Table 3)
    this._createPercentageTable(
      summarySheet,
      "Porcentaje de Edades al Morir (Muertos)",
      "H",
      deadTreatmentEndRow + 2,
      [
        { label: "Edad 0-10 días", formula: "=IF(F8=0, 0, F14/F8)" },
        { label: "Edad 11-20 días", formula: "=IF(F8=0, 0, F15/F8)" },
        { label: "Edad 21-30 días", formula: "=IF(F8=0, 0, F16/F8)" },
        { label: "Edad +31 días", formula: "=IF(F8=0, 0, F17/F8)" },
      ]
    );

    // Table 7: Colostrum data (Q-R)
    summarySheet
      .cell("Q5")
      .value("Resumen de Calostro (Guachera)")
      .style({ bold: true });
    const colostrumMetrics = [
      {
        label: "Terneros Calostrados",
        formula: `=COUNTIFS('Terneros en guachera'!G5:G1048576, ">0", 'Terneros en guachera'!E5:E1048576, ">=${moment(
          fromDate
        ).format(
          "DD-MM-YYYY"
        )}", 'Terneros en guachera'!E5:E1048576, "<=${moment(toDate).format(
          "DD-MM-YYYY"
        )}")`,
        numberFormat: "0",
      },
      {
        label: "Calostro Promedio",
        formula: `=AVERAGEIFS('Terneros en guachera'!G5:G1048576, 'Terneros en guachera'!G5:G1048576, ">0", 'Terneros en guachera'!E5:E1048576, ">=${moment(
          fromDate
        ).format(
          "DD-MM-YYYY"
        )}", 'Terneros en guachera'!E5:E1048576, "<=${moment(toDate).format(
          "DD-MM-YYYY"
        )}")`,
        numberFormat: "0.00",
      },
    ];
    this._createPercentageTable(
      summarySheet,
      "Resumen de Calostro",
      "Q",
      startRowPercentages,
      colostrumMetrics
    );
  }

  /**.
   * @param {Object} workbook
   * @param {Array} calves
   */
  _createGuacheraSheet(workbook, calves) {
    const guacheraSheet = workbook.addSheet("Terneros en guachera");
    this._setupSheet(
      guacheraSheet,
      "Cantidad de terneros",
      calves.length,
      "B4:I4",
      [
        { col: "B", width: 20 },
        { col: "C", width: 10 },
        { col: "D", width: 15 },
        { col: "E", width: 12 },
        { col: "F", width: 13 },
        { col: "G", width: 15 },
        { col: "H", width: 25 },
        { col: "I", width: 12 },
      ],
      [
        "Ternero",
        "Sexo",
        "Tipo de parto",
        "Nacimiento",
        "Peso al nacer",
        "Calostrado",
        "Tratamiento",
        "Cuando fue",
      ]
    );

    calves.forEach((calf, index) => {
      const row = index + 5;
      guacheraSheet.cell(`B${row}`).value(calf.name || "");
      guacheraSheet.cell(`C${row}`).value(calf.gender || "");
      guacheraSheet.cell(`D${row}`).value(calf.birthType || "");

      const birthDate =
        calf.birthDate && moment(calf.birthDate).isValid()
          ? moment(calf.birthDate).toDate()
          : "";
      guacheraSheet
        .cell(`E${row}`)
        .value(birthDate)
        .style(birthDate ? { numberFormat: "dd/mm/yyyy" } : {});

      guacheraSheet.cell(`F${row}`).value(calf.calfWeight || "");
      guacheraSheet.cell(`G${row}`).value(calf.calfCalostro || "");
      guacheraSheet
        .cell(`H${row}`)
        .value(this._getTreatmentName(calf.treatment) || "");

      const startDate =
        calf.startDate && moment(calf.startDate).isValid()
          ? moment(calf.startDate).toDate()
          : "";
      guacheraSheet
        .cell(`I${row}`)
        .value(startDate)
        .style(startDate ? { numberFormat: "dd/mm/yyyy" } : {});

      this._styleRowBorders(guacheraSheet, `B${row}:I${row}`);
    });
  }

  /**
   * @param {Object} workbook
   * @param {Array} calvesBirth
   * @param {string} fromDate
   * @param {string} toDate
   */
  _createBirthSheet(workbook, calvesBirth, fromDate, toDate) {
    const birthSheet = workbook.addSheet("Nacimientos");
    this._setupSheet(
      birthSheet,
      "Cantidad de terneros",
      calvesBirth.length,
      "B4:G4",
      [
        { col: "B", width: 20 },
        { col: "C", width: 10 },
        { col: "D", width: 15 },
        { col: "E", width: 12 },
        { col: "F", width: 13 },
        { col: "G", width: 15 },
      ],
      [
        "Ternero",
        "Sexo",
        "Tipo de parto",
        "Nacimiento",
        "Peso al nacer",
        "Calostrado",
      ],
      "I",
      `Filtrado por fechas: ${this._formatFilterDate(
        fromDate
      )} a ${this._formatFilterDate(toDate)}`
    );

    calvesBirth.forEach((calf, index) => {
      const row = index + 5;
      birthSheet.cell(`B${row}`).value(calf.name || "");
      birthSheet.cell(`C${row}`).value(calf.gender || "");
      birthSheet.cell(`D${row}`).value(calf.birthType || "");

      const birthDate =
        calf.birthDate && moment(calf.birthDate).isValid()
          ? moment(calf.birthDate).toDate()
          : "";
      birthSheet
        .cell(`E${row}`)
        .value(birthDate)
        .style(birthDate ? { numberFormat: "dd/mm/yyyy" } : {});

      birthSheet.cell(`F${row}`).value(calf.calfWeight || "");
      birthSheet.cell(`G${row}`).value(calf.calfCalostro || "");

      this._styleRowBorders(birthSheet, `B${row}:G${row}`);
    });
  }

  /**
   * @param {Object} workbook
   * @param {Array} deadCalves
   * @param {string} fromDate
   * @param {string} toDate
   */
  _createDeadSheet(workbook, deadCalves, fromDate, toDate) {
    const deadSheet = workbook.addSheet("Muertes");
    this._setupSheet(
      deadSheet,
      "Cantidad de terneros",
      deadCalves.length,
      "B4:L4",
      [
        { col: "B", width: 20 },
        { col: "C", width: 10 },
        { col: "D", width: 12 },
        { col: "E", width: 12 },
        { col: "F", width: 13 },
        { col: "G", width: 13 },
        { col: "H", width: 25 },
        { col: "I", width: 25 },
        { col: "J", width: 120 },
        { col: "K", width: 15 },
        { col: "L", width: 15 },
      ],
      [
        "Ternero",
        "Sexo",
        "Tipo de parto",
        "Nacimiento",
        "Fecha de muerte",
        "Calostrado",
        "Tratamiento",
        "Cuando fue",
        "Comentario",
        "Fue retratado",
        "Edad a Muerte (Dias)",
      ],
      "H",
      `Filtrado por fechas: ${this._formatFilterDate(
        fromDate
      )} a ${this._formatFilterDate(toDate)}`
    );

    deadCalves.forEach((calf, index) => {
      const row = index + 5;
      deadSheet.cell(`B${row}`).value(calf.name || "");
      deadSheet.cell(`C${row}`).value(calf.gender || "");
      deadSheet.cell(`D${row}`).value(calf.birthType || "");

      const birthDate =
        calf.birthDate && moment(calf.birthDate).isValid()
          ? moment(calf.birthDate).toDate()
          : "";
      deadSheet
        .cell(`E${row}`)
        .value(birthDate)
        .style(birthDate ? { numberFormat: "dd/mm/yyyy" } : {});

      const deadDate =
        calf.timeDead && moment(calf.timeDead).isValid()
          ? moment(calf.timeDead).toDate()
          : "";
      deadSheet
        .cell(`F${row}`)
        .value(deadDate)
        .style(deadDate ? { numberFormat: "dd/mm/yyyy" } : {});

      deadSheet.cell(`G${row}`).value(calf.calfCalostro || "");
      deadSheet
        .cell(`H${row}`)
        .value(this._getTreatmentName(calf.treatment) || "");

      const startDate =
        calf.startDate && moment(calf.startDate).isValid()
          ? moment(calf.startDate).toDate()
          : "";
      deadSheet
        .cell(`I${row}`)
        .value(startDate)
        .style(startDate ? { numberFormat: "dd/mm/yyyy" } : {});

      deadSheet.cell(`J${row}`).value(calf.comment || "");
      deadSheet.cell(`K${row}`).value(calf.resetTreatment ? "SÍ" : "NO");

      const ageAtDeath =
        birthDate && deadDate
          ? moment(deadDate).diff(moment(birthDate), "days")
          : "";
      deadSheet
        .cell(`L${row}`)
        .value(ageAtDeath)
        .style(ageAtDeath !== "" ? { numberFormat: "0" } : {});

      this._styleRowBorders(deadSheet, `B${row}:L${row}`);
    });
  }

  /**
   * @param {Object} workbook
   * @param {Array} calvesTreated
   * @param {string} fromDate
   * @param {string} toDate
   */
  _createTreatedSheet(workbook, calvesTreated, fromDate, toDate) {
    const treatedSheet = workbook.addSheet("Tratados");
    this._setupSheet(
      treatedSheet,
      "Cantidad de terneros",
      calvesTreated.length,
      "B4:L4",
      [
        { col: "B", width: 20 },
        { col: "C", width: 10 },
        { col: "D", width: 12 },
        { col: "E", width: 12 },
        { col: "F", width: 13 },
        { col: "G", width: 25 },
        { col: "H", width: 12 },
        { col: "I", width: 120 },
        { col: "J", width: 15 },
        { col: "K", width: 15 },
        { col: "L", width: 15 },
      ],
      [
        "Ternero",
        "Sexo",
        "Tipo de parto",
        "Nacimiento",
        "Calostrado",
        "Tratamiento",
        "Cuando fue",
        "Comentario",
        "Fue retratado",
        "Edad a tratamiento (Días)",
        "Estado",
      ],
      "I",
      `Filtrado por fechas: ${this._formatFilterDate(
        fromDate
      )} a ${this._formatFilterDate(toDate)}`
    );

    calvesTreated.forEach((calf, index) => {
      const row = index + 5;
      treatedSheet.cell(`B${row}`).value(calf.name || "");
      treatedSheet.cell(`C${row}`).value(calf.gender || "");
      treatedSheet.cell(`D${row}`).value(calf.birthType || "");

      const birthDate =
        calf.birthDate && moment(calf.birthDate).isValid()
          ? moment(calf.birthDate).toDate()
          : "";
      treatedSheet
        .cell(`E${row}`)
        .value(birthDate)
        .style(birthDate ? { numberFormat: "dd/mm/yyyy" } : {});

      treatedSheet.cell(`F${row}`).value(calf.calfCalostro || "");
      treatedSheet
        .cell(`G${row}`)
        .value(this._getTreatmentName(calf.treatment) || "");

      const startDate =
        calf.startDate && moment(calf.startDate).isValid()
          ? moment(calf.startDate).toDate()
          : "";
      treatedSheet
        .cell(`H${row}`)
        .value(startDate)
        .style(startDate ? { numberFormat: "dd/mm/yyyy" } : {});

      treatedSheet.cell(`I${row}`).value(calf.comment || "");
      treatedSheet.cell(`J${row}`).value(calf.resetTreatment ? "SÍ" : "NO");

      const ageAtTreatment =
        birthDate && startDate
          ? moment(startDate).diff(moment(birthDate), "days")
          : "";
      treatedSheet
        .cell(`K${row}`)
        .value(ageAtTreatment)
        .style(ageAtTreatment !== "" ? { numberFormat: "0" } : {});

      treatedSheet.cell(`L${row}`).value(calf.isDead ? "Murió" : "Recuperado");

      this._styleRowBorders(treatedSheet, `B${row}:L${row}`);
    });
  }

  /**
   * @param {Object} workbook
   * @param {Array} calvesReleased
   * @param {string} fromDate
   * @param {string} toDate
   */
  _createReleasedSheet(workbook, calvesReleased, fromDate, toDate) {
    const releasedSheet = workbook.addSheet("Largados");
    this._setupSheet(
      releasedSheet,
      "Cantidad de terneros",
      calvesReleased.length,
      "B4:M4",
      [
        { col: "B", width: 20 },
        { col: "C", width: 10 },
        { col: "D", width: 12 },
        { col: "E", width: 12 },
        { col: "F", width: 13 },
        { col: "G", width: 15 },
        { col: "H", width: 20 },
        { col: "I", width: 20 },
        { col: "J", width: 15 },
        { col: "K", width: 15 },
        { col: "L", width: 25 },
        { col: "M", width: 15 },
      ],
      [
        "Ternero",
        "Sexo",
        "Tipo de parto",
        "Nacimiento",
        "Día largado",
        "Días en guachera",
        "Peso al nacimiento",
        "Peso al ser largado",
        "Kilos ganados",
        "Aumento x día",
        "Tratamiento",
        "Cuando fue",
      ],
      "G",
      `Filtrado por fechas: ${this._formatFilterDate(
        fromDate
      )} a ${this._formatFilterDate(toDate)}`
    );
    releasedSheet
      .cell("K2")
      .value(
        "Los terneros que no tengan un peso inicial se les agrega 35kg que es un valor promedio"
      );

    calvesReleased.forEach((calf, index) => {
      const row = index + 5;
      releasedSheet.cell(`B${row}`).value(calf.name || "");
      releasedSheet.cell(`C${row}`).value(calf.gender || "");
      releasedSheet.cell(`D${row}`).value(calf.birthType || "");

      const birthDate =
        calf.birthDate && moment(calf.birthDate).isValid()
          ? moment(calf.birthDate).toDate()
          : "";
      releasedSheet
        .cell(`E${row}`)
        .value(birthDate)
        .style(birthDate ? { numberFormat: "dd/mm/yyyy" } : {});

      const releaseDate =
        calf.whenReleased && moment(calf.whenReleased).isValid()
          ? moment(calf.whenReleased).toDate()
          : "";
      releasedSheet
        .cell(`F${row}`)
        .value(releaseDate)
        .style(releaseDate ? { numberFormat: "dd/mm/yyyy" } : {});

      const daysInGuachera =
        birthDate && releaseDate
          ? moment(releaseDate).diff(moment(birthDate), "days")
          : "";
      releasedSheet
        .cell(`G${row}`)
        .value(daysInGuachera)
        .style(daysInGuachera !== "" ? { numberFormat: "0" } : {});

      // Convertir peso al nacimiento a número, usar 35 si no es válido
      const birthWeight = !isNaN(Number(calf.calfWeight))
        ? Number(calf.calfWeight)
        : 35;
      releasedSheet
        .cell(`H${row}`)
        .value(birthWeight)
        .style({ numberFormat: "0.00" });

      // Convertir peso al ser largado a número, dejar vacío si no es válido
      const releasedWeight = !isNaN(Number(calf.releasedWeight))
        ? Number(calf.releasedWeight)
        : "";
      releasedSheet
        .cell(`I${row}`)
        .value(releasedWeight)
        .style(releasedWeight !== "" ? { numberFormat: "0.00" } : {});

      // Calcular kilos ganados si ambos pesos son válidos
      let weightDifference = "";
      if (releasedWeight !== "" && birthWeight !== "") {
        weightDifference = releasedWeight - birthWeight;
        releasedSheet
          .cell(`J${row}`)
          .value(weightDifference)
          .style({ numberFormat: "0.00" });
      } else if (!isNaN(Number(calf.weightDiference))) {
        weightDifference = Number(calf.weightDiference);
        releasedSheet
          .cell(`J${row}`)
          .value(weightDifference)
          .style({ numberFormat: "0.00" });
      } else {
        releasedSheet
          .cell(`J${row}`)
          .formula(`=IF(AND(I${row}<>"",H${row}<>""),I${row}-H${row},"")`);
      }

      // Calcular aumento por día si kilos ganados y días en guachera son válidos
      if (
        weightDifference !== "" &&
        daysInGuachera !== "" &&
        daysInGuachera > 0
      ) {
        const weightGainPerDay = weightDifference / daysInGuachera;
        releasedSheet
          .cell(`K${row}`)
          .value(weightGainPerDay)
          .style({ numberFormat: "0.000" });
      } else if (!isNaN(Number(calf.weightGainPerDay))) {
        releasedSheet
          .cell(`K${row}`)
          .value(Number(calf.weightGainPerDay))
          .style({ numberFormat: "0.000" });
      } else {
        releasedSheet
          .cell(`K${row}`)
          .formula(
            `=IF(AND(J${row}<>"",G${row}<>"",G${row}>0),J${row}/G${row},"")`
          );
      }

      releasedSheet
        .cell(`L${row}`)
        .value(this._getTreatmentName(calf.treatment) || "");

      const startDate =
        calf.startDate && moment(calf.startDate).isValid()
          ? moment(calf.startDate).toDate()
          : "";
      releasedSheet
        .cell(`M${row}`)
        .value(startDate)
        .style(startDate ? { numberFormat: "dd/mm/yyyy" } : {});

      this._styleRowBorders(releasedSheet, `B${row}:M${row}`);
    });
  }

  /**
   * @param {Array} calves
   * @param {Array} calvesBirth
   * @param {Array} calvesTreated
   * @param {Array} calvesReleased
   * @param {Array} deadCalves
   * @param {string} fromDate
   * @param {string} toDate
   * @returns {string}
   */
  async createExcel(
    calves,
    calvesBirth,
    calvesTreated,
    calvesReleased,
    deadCalves,
    fromDate,
    toDate
  ) {
    try {
      const workbook = await XlsxPopulate.fromBlankAsync();
      this._createSummarySheet(
        workbook,
        fromDate,
        toDate,
        deadCalves,
        calvesBirth,
        calvesReleased,
        calvesTreated
      );
      this._createGuacheraSheet(workbook, calves);
      this._createBirthSheet(workbook, calvesBirth, fromDate, toDate);
      this._createDeadSheet(workbook, deadCalves, fromDate, toDate);
      this._createTreatedSheet(workbook, calvesTreated, fromDate, toDate);
      this._createReleasedSheet(workbook, calvesReleased, fromDate, toDate);

      const fileName = `ResumenTerneros.xlsx`;
      const filePath = `./${fileName}`;
      await workbook.toFileAsync(filePath);
      return filePath;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ExcelManager;
