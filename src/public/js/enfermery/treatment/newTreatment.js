const durationSelect = document.getElementById("durationSelect");
const dayInputsContainer = document.getElementById("day-inputs-container");
const formNewTreatment = document.querySelector(
  'form[action="/treatment/add"]'
);
durationSelect.addEventListener("change", () => {
  const days = parseInt(durationSelect.value, 10) || 0;

  dayInputsContainer.innerHTML = "";

  for (let i = 1; i <= days; i++) {
    const dayDiv = document.createElement("div");
    dayDiv.setAttribute("data-day", i);

    const dayLabel = document.createElement("label");
    dayLabel.setAttribute("for", `day-${i}`);
    dayLabel.textContent = `Día ${i}:`;

    const dayInput = document.createElement("input");
    dayInput.setAttribute("type", "text");
    dayInput.setAttribute("id", `day-${i}`);
    dayInput.setAttribute("name", `day${i}`);
    dayInput.setAttribute("placeholder", `${i}° día de tratamiento`);

    dayDiv.appendChild(dayLabel);
    dayDiv.appendChild(dayInput);

    dayInputsContainer.appendChild(dayDiv);
  }
});

formNewTreatment.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const formObject = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/treatment/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formObject),
    });

    const result = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Tratamiento creado con éxito",
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
