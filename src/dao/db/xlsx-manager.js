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
      sheet.cell("D4").value("Tipo de parto"); 
      sheet.cell("E4").value("Nacimiento");   
      sheet.cell("F4").value("Peso al nacer");
      sheet.cell("G4").value("Calostrado");    
      sheet.cell("H4").value("Tratamiento");   
      sheet.cell("I4").value("Cuando fue");    

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
      sheet.column("D").width(15);
      sheet.column("E").width(12);
      sheet.column("F").width(13);
      sheet.column("G").width(15);
      sheet.column("H").width(25);
      sheet.column("I").width(12);
      calves.forEach((calf, index) => {
        const row = index + 5;

        sheet.cell(`B${row}`).value(calf.name || "");
        sheet.cell(`C${row}`).value(calf.gender || "");
        
       
        sheet.cell(`D${row}`).value(calf.birthType || "");

        
        const birthDate = calf.birthDate 
              ? moment(calf.birthDate, "YYYY-MM-DD").toDate() 
              : null;
        sheet.cell(`E${row}`).value(birthDate); 
        sheet.cell(`E${row}`).style("numberFormat", "dd/mm/yyyy");

        sheet.cell(`F${row}`).value(calf.calfWeight || ""); 
        sheet.cell(`G${row}`).value(calf.calfCalostro || ""); 
        
        let treatmentName = "";
        if (typeof calf.treatment === 'string') {
          treatmentName = calf.treatment;
        } else if (Array.isArray(calf.treatment) && calf.treatment.length > 0) {
          const treatmentObj = calf.treatment[0];
          treatmentName = treatmentObj.title || "";
        }
        sheet.cell(`H${row}`).value(treatmentName); 

        const startDate = calf.startDate 
              ? moment(calf.startDate, "YYYY-MM-DD").toDate() 
              : null;
        sheet.cell(`I${row}`).value(startDate); 
        sheet.cell(`I${row}`).style("numberFormat", "dd/mm/yyyy");
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
      sheet.cell("D4").value("Tipo de parto"); 
      sheet.cell("E4").value("Nacimiento");    
      sheet.cell("F4").value("Dia largado");  
      sheet.cell("G4").value("Dias en guachera"); 
      sheet.cell("H4").value("Peso al nacimiento"); 
      sheet.cell("I4").value("Peso al ser largado"); 
      sheet.cell("J4").value("Kilos ganados");  
      sheet.cell("K4").value("Aumento x día");  
      sheet.cell("L4").value("Tratamiento");    
      sheet.cell("M4").value("Cuando fue");    

      
      sheet.range("B4:M4").style({
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
      sheet.column("E").width(12); 
      sheet.column("F").width(13); 
      sheet.column("G").width(15);
      sheet.column("H").width(20); 
      sheet.column("I").width(20); 
      sheet.column("J").width(15); 
      sheet.column("K").width(15);
      sheet.column("L").width(25); 
      sheet.column("M").width(15);

      calvesReleased.forEach((calf, index) => {
        const row = index + 5;

        sheet.cell(`B${row}`).value(calf.name || "");
        sheet.cell(`C${row}`).value(calf.gender || "");

        
        sheet.cell(`D${row}`).value(calf.birthType || "");

        
        const birthDate = calf.birthDate
                ? moment(calf.birthDate, "YYYY-MM-DD").toDate()
                : null;
        sheet.cell(`E${row}`).value(birthDate); 
        sheet.cell(`E${row}`).style("numberFormat", "dd/mm/yyyy");

        const releaseDate = calf.whenReleased
            ? moment(calf.whenReleased, "YYYY-MM-DD").toDate()
            : null;
        sheet.cell(`F${row}`).value(releaseDate); 
        sheet.cell(`F${row}`).style("numberFormat", "dd/mm/yyyy");

        sheet.cell(`G${row}`).value(calf.daysInGuachera || ""); 
        sheet.cell(`H${row}`).value(calf.calfWeight || "35");  
        sheet.cell(`I${row}`).value(calf.releasedWeight || ""); 

        if (typeof calf.weightDiference === 'number') {
          sheet.cell(`J${row}`).value(calf.weightDiference);
        } else {
          sheet.cell(`J${row}`).formula(`=I${row}-H${row}`); 
        }
      
        if (typeof calf.weightGainPerDay === 'number') {
          sheet.cell(`K${row}`).value(calf.weightGainPerDay); 
        } else {
          sheet.cell(`K${row}`).formula(`=J${row}/G${row}`); 
        }
        sheet.column("K").style({ numberFormat: "0.000" });

        let treatmentName = "";
        if (typeof calf.treatment === 'string') {
          treatmentName = calf.treatment;
        } else if (Array.isArray(calf.treatment) && calf.treatment.length > 0) {
          const treatmentObj = calf.treatment[0];
          treatmentName = treatmentObj.title || "";
        }
        sheet.cell(`L${row}`).value(treatmentName); 

        const startDate = calf.startDate
                ? moment(calf.startDate, "YYYY-MM-DD").toDate()
                : null;
        sheet.cell(`M${row}`).value(startDate); 
        sheet.cell(`M${row}`).style("numberFormat", "dd/mm/yyyy");

        
        sheet.range(`B${row}:M${row}`).style({
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
      sheet.cell("D4").value("Tipo de parto"); 
      sheet.cell("E4").value("Nacimiento");    
      sheet.cell("F4").value("Fecha de muerte");
      sheet.cell("G4").value("Calostrado");     
      sheet.cell("H4").value("Tratamiento");   
      sheet.cell("I4").value("Cuando fue");     
      sheet.cell("J4").value("Comentario");     
      sheet.cell("K4").value("Fue retratado");  

      
      sheet.range("B4:K4").style({
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
      sheet.column("E").width(12); 
      sheet.column("F").width(13); 
      sheet.column("G").width(13); 
      sheet.column("H").width(25); 
      sheet.column("I").width(25); 
      sheet.column("J").width(120); 
      sheet.column("K").width(15);  

      deadCalves.forEach((calf, index) => {
        const row = index + 5;
        sheet.cell(`B${row}`).value(calf.name || "");
        sheet.cell(`C${row}`).value(calf.gender || "");

       
        sheet.cell(`D${row}`).value(calf.birthType || "");

        
        const birthDate = calf.birthDate
                ? moment(calf.birthDate, "YYYY-MM-DD").toDate()
                : null;
        sheet.cell(`E${row}`).value(birthDate);
        sheet.cell(`E${row}`).style("numberFormat", "dd/mm/yyyy");

        const deadDate = calf.timeDead
            ? moment(calf.timeDead, "YYYY-MM-DD").toDate()
            : null;
        sheet.cell(`F${row}`).value(deadDate);
        sheet.cell(`F${row}`).style("numberFormat", "dd/mm/yyyy");    

        sheet.cell(`G${row}`).value(calf.calostro || ""); 

        let treatmentName = "";
        if (typeof calf.treatment === 'string') {
          treatmentName = calf.treatment;
        } else if (Array.isArray(calf.treatment) && calf.treatment.length > 0) {
          const treatmentObj = calf.treatment[0];
          treatmentName = treatmentObj.title || "";
        }
        sheet.cell(`H${row}`).value(treatmentName); 

        const startDate = calf.startDate
            ? moment(calf.startDate, "YYYY-MM-DD").toDate()
            : null;
        sheet.cell(`I${row}`).value(startDate);
        sheet.cell(`I${row}`).style("numberFormat", "dd/mm/yyyy");

        sheet.cell(`J${row}`).value(calf.comment || "");

        sheet.cell(`K${row}`).value(calf.resetTreatment ? "SI" : "NO"); 

        
        sheet.range(`B${row}:K${row}`).style({
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
  }}

module.exports = ExcelManager;
