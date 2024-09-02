const XlsxPopulate = require("xlsx-populate");
const moment = require("moment-timezone");

class ExcelManager {
  async createExcelAllCalves(calves) {
    try {
      const workbook = await XlsxPopulate.fromBlankAsync();
      const sheet = workbook.sheet(0);
      const quantityOfCalves = calves.length  
      
      sheet.cell("B2").value("Cantidad de terneros")
      sheet.cell("C2").value(quantityOfCalves)
      sheet.cell("I2").value("Este archivo generado por Cattle Care || Contacto: 3534270126")

      sheet.freezePanes(0, 4); 
      sheet.cell("B4").value("Ternero");
      sheet.cell("C4").value("Sexo");
      sheet.cell("D4").value("Nacimiento");
      sheet.cell("E4").value("Peso al nacer");
      sheet.cell("F4").value("Calostrado");
      sheet.cell("G4").value("Tratamiento");
      sheet.cell("H4").value("Cuando fue");
      sheet.cell("I4").value("Protocolo");
      

      sheet.range("B4:I4").style({
        fill: { type: "solid", color: "FFFF00" },
        border: {
          top: { style: "thick", color: "000000" },
          bottom: { style: "thick", color: "000000" },
          left: { style: "thick", color: "000000" },
          right: { style: "thick", color: "000000" },
        },
      });

      sheet.column("B").width(20);
      sheet.column("C").width(10);
      sheet.column("D").width(12);
      sheet.column("E").width(13);
      sheet.column("F").width(15);
      sheet.column("G").width(25);
      sheet.column("H").width(12);
      sheet.column("I").width(160);
      calves.forEach((calf, index) => {
        const row = index + 5;

        sheet.cell(`B${row}`).value(calf.name || "");
        sheet.cell(`C${row}`).value(calf.gender || "");
        const formattedBirthDate = calf.birthDate
          ? moment(calf.birthDate)
              .format("DD/MM/YYYY")
          : "";
        sheet.cell(`D${row}`).value(formattedBirthDate || "");
        sheet.cell(`E${row}`).value(calf.calfWeight || "");
        sheet.cell(`F${row}`).value(calf.calfCalostro || "");
        const formattedStartDate = calf.startDate
          ? moment(calf.startDate)
            .format("DD/MM/YYYY")
          :"";
        sheet.cell(`G${row}`).value(calf.treatment || "");
        sheet.cell(`H${row}`).value(formattedStartDate || "");
        sheet.cell(`I${row}`).value(calf.medication || "");
        sheet.range(`B${row}:I${row}`).style({
          border: {
            bottom: { style: "thin", color: "000000" },
            left: { style: "thin", color: "000000" },
            right: { style: "thin", color: "000000" },
          },
        });
      });

      const filePath = "./TernerosGuachera.xlsx";
      await workbook.toFileAsync(filePath);

      console.log("Archivo generado con exito");
      return filePath;
    } catch (error) {
      console.log(error);
    }
  }

  async createExcelReleasedCalves(calvesReleased) {
    try {
      const workbook = await XlsxPopulate.fromBlankAsync();
      const sheet = workbook.sheet(0);
      const quantityOfCalves = calvesReleased.length

      sheet.cell("B2").value("Cantidad de terneros")
      sheet.cell("C2").value(quantityOfCalves)
      sheet.cell("G2").value("Este archivo generado por Cattle Care || Contacto: 3534270126")
      sheet.cell("K2").value("Los terneros que no tengan un peso inicial se les agrega 35kl que es un valor promedio")

      sheet.freezePanes(0, 4); 
      sheet.cell("B4").value("Ternero");
      sheet.cell("C4").value("Sexo");
      sheet.cell("D4").value("Nacimiento");
      sheet.cell("E4").value("Dia largado");
      sheet.cell("F4").value("Dias en guachera");
      sheet.cell("G4").value("Peso al nacimiento");
      sheet.cell("H4").value("Peso al ser largado");
      sheet.cell("I4").value("Kilos ganados");
      sheet.cell("J4").value("Aumento x día");
      sheet.cell("K4").value("Tratamiento");
      sheet.cell("L4").value("Cuando fue");

      sheet.range("B4:L4").style({
        fill: { type: "solid", color: "FFFF00" },
        border: {
          top: { style: "thick", color: "000000" },
          bottom: { style: "thick", color: "000000" },
          left: { style: "thick", color: "000000" },
          right: { style: "thick", color: "000000" },
        },
      });

      sheet.column("B").width(20);
      sheet.column("C").width(10);
      sheet.column("D").width(12);
      sheet.column("E").width(13);
      sheet.column("F").width(15);
      sheet.column("G").width(20);
      sheet.column("H").width(20);
      sheet.column("I").width(15);
      sheet.column("J").width(15);
      sheet.column("K").width(25);
      sheet.column("L").width(15);
      calvesReleased.forEach((calf, index) => {
        const row = index + 5;

        sheet.cell(`B${row}`).value(calf.name || "");
        sheet.cell(`C${row}`).value(calf.gender || "");

        const formattedBirthDate = calf.birthDate
          ? moment(calf.birthDate)
              .format("DD/MM/YYYY")
          : "";
        const formattedReleaseDate = calf.whenReleased
          ? moment(calf.whenReleased)   
              .format("DD/MM/YYYY")
          : "";

        sheet.cell(`D${row}`).value(formattedBirthDate);
        sheet.cell(`E${row}`).value(formattedReleaseDate);
        sheet.cell(`F${row}`).value(calf.daysInGuachera || "");
        sheet.cell(`G${row}`).value(calf.calfWeight || "35");
        sheet.cell(`H${row}`).value(calf.releasedWeight || "");
        if (typeof calf.weightDiference === 'number') {
          sheet.cell(`I${row}`).value(calf.weightDiference);
        } else {
          sheet.cell(`I${row}`).formula(`=H${row}-G${row}`);
        }
      
      
        if (typeof calf.weightGainPerDay === 'number') {
          sheet.cell(`J${row}`).value(calf.weightGainPerDay);
        } else {
          sheet.cell(`J${row}`).formula(`=I${row}/F${row}`);
        }
        sheet.column("J").style({ numberFormat: "0.000" });

        sheet.cell(`K${row}`).value(calf.treatment || "");

        const formattedStartDate = calf.startDate
          ? moment(calf.startDate)
            .format("DD/MM/YYYY")
          :"";
        sheet.cell(`L${row}`).value(formattedStartDate || "");

        sheet.range(`B${row}:L${row}`).style({
          border: {
            bottom: { style: "thin", color: "000000" },
            left: { style: "thin", color: "000000" },
            right: { style: "thin", color: "000000" },
          },
        });
      });

      const filePath = "./TernerosLargados.xlsx";
      await workbook.toFileAsync(filePath);

      console.log("Archivo generado con exito");
      return filePath;
    } catch (error) {
      console.log(error);
    }
  }

  async createExcelDeadCalves(deadCalves) {
    try {
      const workbook = await XlsxPopulate.fromBlankAsync();
      const sheet = workbook.sheet(0);
      const quantityOfCalves = deadCalves.length 
      
      sheet.cell("B2").value("Cantidad de terneros")
      sheet.cell("C2").value(quantityOfCalves)
      sheet.cell("H2").value("Este archivo generado por Cattle Care || Contacto: 3534270126")

      sheet.freezePanes(0, 4); 

      sheet.cell("B4").value("Ternero");
      sheet.cell("C4").value("Sexo");
      sheet.cell("D4").value("Nacimiento");
      sheet.cell("E4").value("Fecha de muerte");
      sheet.cell("F4").value("Calostrado");
      sheet.cell("G4").value("Tratamiento");
      sheet.cell("H4").value("Cuando fue");
      sheet.cell("I4").value("Comentario");
      sheet.cell("J4").value("Fue retratado");
      sheet.cell("K4").value("Otro tratamiento previo");
      sheet.cell("L4").value("Cuando fue");
      sheet.range("B4:L4").style({
        fill: { type: "solid", color: "FFFF00" },
        border: {
          top: { style: "thick", color: "000000" },
          bottom: { style: "thick", color: "000000" },
          left: { style: "thick", color: "000000" },
          right: { style: "thick", color: "000000" },
        },
      });

      sheet.column("B").width(20);
      sheet.column("C").width(10);
      sheet.column("D").width(12);
      sheet.column("E").width(13);
      sheet.column("F").width(13);
      sheet.column("G").width(25);
      sheet.column("H").width(25);
      sheet.column("I").width(120);
      sheet.column("J").width(15);
      sheet.column("K").width(25);
      sheet.column("L").width(15);
      deadCalves.forEach((calf, index) => {
        const row = index + 5;
        sheet.cell(`B${row}`).value(calf.name);
        sheet.cell(`C${row}`).value(calf.gender);

        const formattedBirthDate = calf.birthDate
          ? moment(calf.birthDate)
              .format("DD/MM/YYYY")
          : "";
        const formattedDeadDate = calf.timeDead
          ? moment(calf.timeDead)
              .format("DD/MM/YYYY")
          : "";
        sheet.cell(`D${row}`).value(formattedBirthDate);
        sheet.cell(`E${row}`).value(formattedDeadDate);
        sheet.cell(`F${row}`).value(calf.calostro || "");
        sheet.cell(`G${row}`).value(calf.treatment || "N/A");
        const formattedStartDate = calf.startDate
          ? moment(calf.startDate)
              .format("DD/MM/YYYY")
          : "";
        sheet.cell(`H${row}`).value(formattedStartDate || "");
        sheet.cell(`I${row}`).value(calf.comment || "");

        sheet.cell(`J${row}`).value(calf.resetTreatment ? "SI" : "NO");
        sheet.cell(`K${row}`).value(calf.prevTreatment || "");

        const formattedPrevDate = calf.prevEndDate
          ? moment(calf.prevEndDate)
              .format("DD/MM/YYYY")   
          : "";
        sheet.cell(`L${row}`).value(formattedPrevDate || "");

        sheet.range(`B${row}:L${row}`).style({
          border: {
            bottom: { style: "thin", color: "000000" },
            left: { style: "thin", color: "000000" },
            right: { style: "thin", color: "000000" },
          },
        });
      });

      const filePath = "./ternerosMuertos.xlsx";
      await workbook.toFileAsync(filePath);

      console.log("Archivo generado con exito");
      return filePath;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ExcelManager;
