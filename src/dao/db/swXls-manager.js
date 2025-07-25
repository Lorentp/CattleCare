const XLSX = require("xlsx");
const moment = require("moment-timezone");

class ExcelSwManager {
  /**
   * @param {string} dateStr
   * @returns {string}
   */
  _formatDate(dateStr, format = "DD/MM/YY") {
    if (!dateStr || !moment(dateStr).isValid()) return "";
    return moment(dateStr).format(format);
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
   * @param {Array} calves
   * @returns {Promise<string>}
   */
  async createSwExcel(calves) {
    try {
      // Preparar los datos para la hoja de Excel
      const data = [
        // Fila de header principal
        ["ALTA DE ANIMALES"],
        // Fila vacía o separador si es necesario
        [],
        // Headers de columnas
        [
          "RP",
          "Nombre",
          "Apodo",
          "RC",
          "HBA",
          "Trazabilidad",
          "Sexo",
          "Raza",
          "Fecha Nac.",
          "Fecha Ingreso",
          "Categoría",
          "RP Madre",
          "HBA Padre",
          "Apodo Padre",
          "N° Partos",
          "Observaciones",
        ],
      ];

      // Agregar filas de datos basadas en los calves
      calves.forEach((calf) => {
        const birthDate = this._formatDate(calf.birthDate, "DD/MM/YY");
        const ingresoDate = birthDate
          ? moment(calf.birthDate).add(1, "days").format("DD/MM/YY")
          : "";

        const gender =
          calf.gender === "Hembra" ? "H" : calf.gender === "Macho" ? "M" : "";

        data.push([
          calf.name || "", // RP
          "", // Nombre: NADA
          "", // Apodo: NADA
          "", // RC: NADA
          "", // HBA: NADA
          "", // Trazabilidad: NADA
          gender, // Sexo
          "", // Raza: NADA
          birthDate, // Fecha Nac.
          ingresoDate, // Fecha Ingreso: birthDate + 1
          "", // Categoría: NADA
          calf.mother || "", // RP Madre
          "", // HBA Padre: NADA
          "", // Apodo Padre: NADA
          "", // N° Partos: NADA
          this._getTreatmentName(calf.treatment) || "", // Observaciones: treatment.name
        ]);
      });

      // Crear el workbook y la hoja
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Alta de Animales");

      // Generar el archivo en formato XLS (BIFF8)
      const fileName = `PLANTILLA_SW_ANIMALES.xls`;
      const filePath = `./${fileName}`;
      XLSX.writeFile(wb, filePath, { bookType: "xls" });

      return filePath;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ExcelSwManager;
