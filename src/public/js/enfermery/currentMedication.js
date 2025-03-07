document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    document.querySelectorAll(".medication-container").forEach((container) => {
      const startDateString = container.dataset.startDate;
  
      if (!startDateString) {
        console.error("❌ Error: No se encontró startDate en dataset");
        return;
      }
  
      const startDate = new Date(startDateString);
  
      if (isNaN(startDate)) {
        console.error("❌ Error: startDate es una fecha inválida");
        return;
      }
  
      const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  
      let medicationArray = [];
  
      try {
        const medicationData = container.dataset.medication;
  
        if (medicationData && medicationData !== "undefined") {
          medicationArray = JSON.parse(medicationData);
          
        }
      } catch (error) {
        console.error("❌ Error al parsear la medicación:", error);
      }
  
      const medication =
        diffDays >= 0 && diffDays < medicationArray.length
          ? medicationArray[diffDays]
          : "No hay medicación para hoy";
  
  
      container.querySelector(".medication").textContent = `Suministrar el dia de hoy: ${medication}`;
    });
  });