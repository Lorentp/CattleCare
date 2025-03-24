document.addEventListener("DOMContentLoaded", () => {
  const treatmentSelect = document.getElementById("nameInputUpdateTreatment");
  const durationSelect = document.getElementById("durationUpdateSelect");
  const idInput = document.getElementById("idInputUpdateTreatment");
  const dayInputsContainer = document.getElementById(
    "day-inputs-update-container"
  );
  const formUpdateTreatment = document.getElementById(
    "updateTreatmentFormData"
  );

  if (
    !treatmentSelect ||
    !durationSelect ||
    !idInput ||
    !dayInputsContainer ||
    !formUpdateTreatment
  ) {
    console.error("Faltan elementos en el DOM");
    return;
  }

  function generateMedicationInputs(duration, medications = []) {
    dayInputsContainer.innerHTML = "";
    for (let i = 0; i < duration; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "day-input";

      const dayLabel = document.createElement("label");
      dayLabel.textContent = `Día ${i + 1}:`;
      dayLabel.setAttribute("for", `medication-day-${i}`);

      const dayInput = document.createElement("input");
      dayInput.type = "text";
      dayInput.id = `medication-day-${i}`;
      dayInput.name = `medication[${i}]`;
      dayInput.value = medications[i] || "";
      dayInput.placeholder = `Medicamento para el día ${i + 1}`;

      dayDiv.appendChild(dayLabel);
      dayDiv.appendChild(dayInput);
      dayInputsContainer.appendChild(dayDiv);
    }
  }

  // Evento al seleccionar un tratamiento
  treatmentSelect.addEventListener("change", () => {
    const selectedOption =
      treatmentSelect.options[treatmentSelect.selectedIndex];
    if (!selectedOption.value) {
      idInput.value = "";
      durationSelect.value = "";
      dayInputsContainer.innerHTML = "";
      return;
    }
    const treatmentId = selectedOption.value;
    const title = selectedOption.getAttribute("data-title");
    const duration = parseInt(selectedOption.getAttribute("data-duration"), 10);
    const medications = JSON.parse(
      selectedOption.getAttribute("data-medication") || "[]"
    );

    // Actualizar formulario
    idInput.value = treatmentId;
    durationSelect.value = duration;
    generateMedicationInputs(duration, medications);
  });

  durationSelect.addEventListener("change", () => {
    const newDuration = parseInt(durationSelect.value, 10);
    if (!isNaN(newDuration)) {
      const currentMedications = Array.from(
        dayInputsContainer.querySelectorAll("input")
      ).map((input) => input.value);
      generateMedicationInputs(
        newDuration,
        currentMedications.slice(0, newDuration)
      );
    }
  });

  // Evento al enviar el formulario
  formUpdateTreatment.addEventListener("submit", async (event) => {
    event.preventDefault();

    const treatmentId = idInput.value;
    const duration = parseInt(durationSelect.value, 10);
    const medications = Array.from(
      dayInputsContainer.querySelectorAll("input")
    ).map((input) => input.value.trim());

    if (!treatmentId || isNaN(duration) || medications.length !== duration) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    if (!treatmentId || isNaN(duration) || medications.length !== duration) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Por favor, completa todos los campos correctamente.",
      });
      return;
    }

    const updatedTreatment = {
      _id: treatmentId,
      title:
        treatmentSelect.options[treatmentSelect.selectedIndex].getAttribute(
          "data-title"
        ),
      duration: duration,
      medication: medications,
    };

    try {
      const response = await fetch(`/treatment/update/${treatmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTreatment),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Tratamiento modificado con éxito",
        }).then(() => {
          window.location.href = "/enfermeria";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "No se pudo actualizar el tratamiento.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error inesperado, intenta más tarde.",
      });
      console.error("Error:", error);
    }
  });
});
