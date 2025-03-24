/*Form para agregar terneros*/
const formCalfToTreatment = document.querySelector(
  'form[action="/calf/addtotreatment"]'
);
const treatmentSelect = document.getElementById("treatment");
const startDateInput = document.getElementById("startDate");
const infoTreatment = document.getElementById("infoTreatment");
const durationInput = document.getElementById("duration");
const endDateInput = document.getElementById("endDate");
const corral = document.getElementById("corral");
const corralIdInput = document.getElementById("corralIdInput");
const day1Example = document.getElementById("day1Example");

function updateCorralInfo() {
  const selectedOption = corral.options[corral.selectedIndex];
  const corralId = selectedOption.getAttribute("corralId");
  corralIdInput.value = corralId;
}

function calculateEndDate(startDate, duration) {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(
    startDateObj.getTime() + duration * 24 * 60 * 60 * 1000
  );
  return endDateObj.toLocaleDateString();
}

function updateTreatmentInfo() {
  const selectedOption = treatmentSelect.options[treatmentSelect.selectedIndex];
  if (!selectedOption || selectedOption.value === "") {
    console.log("No se seleccionó tratamiento.");
    return;
  }
  const duration = parseInt(selectedOption.getAttribute("data-duration"), 10);

  const medicationJson = selectedOption.getAttribute("data-medication");
  const medication = JSON.parse(medicationJson);
  day1Example.value =
    medication[0] || "No hay información disponible para el Día 1.";

  if (!startDateInput.value || isNaN(duration)) {
    console.log("Falta fecha de inicio o duración inválida.");
    endDateInput.value = "";
    return;
  }

  const startDate = new Date(startDateInput.value);

  if (startDate && !isNaN(duration)) {
    const endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + (duration - 1));
    const formattedEndDate = endDate.toISOString().slice(0, 10);
    durationInput.value = duration;
    endDateInput.value = formattedEndDate;
  } else {
    durationInput.value = "";
    endDateInput.value = "";
  }
}

formCalfToTreatment.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const formObject = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/calf/addtotreatment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formObject),
    });

    const result = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Ternero agregado a tratamiento",
      }).then(() => {
        window.location.href = "/enfermeria";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "Ha ocurrido un error, intenta de nuevo.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ha ocurrido un error inesperado, intenta más tarde.",
    });
    console.error(error);
  }
});

treatment.addEventListener("change", updateTreatmentInfo);
startDateInput.addEventListener("change", updateTreatmentInfo);
corral.addEventListener("change", updateCorralInfo);
