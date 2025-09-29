const calfSelect = document.getElementById("calfSelect");
const calfInfo = document.getElementById("calfInfo");
const protocolsSection = document.getElementById("protocolsSection");
const protocolsButtons = document.getElementById("protocolsButtons");

// Verificar elementos del DOM
const elements = {
  calfName: document.getElementById("calfName"),
  calfBirthDate: document.getElementById("calfBirthDate"),
  calfGender: document.getElementById("calfGender"),
  calfWeight: document.getElementById("calfWeight"),
  calfCalostro: document.getElementById("calfCalostro"),
};

// Usar protocols desde la variable global
const protocols = window.protocols || [];

calfSelect.addEventListener("change", async (e) => {
  const calfId = e.target.value;
  if (!calfId) {
    calfInfo.classList.add("hidden");
    protocolsSection.classList.add("hidden");
    return;
  }

  // Fetch info del ternero
  try {
    const response = await fetch(`/calf/${calfId}`);
    if (!response.ok) {
      throw new Error(
        `Error en la solicitud: ${response.status} ${response.statusText}`
      );
    }
    const calf = await response.json();

    // Llenar ficha
    document.getElementById("calfName").textContent =
      calf.name || "No registrado";
    document.getElementById("calfBirthDate").textContent = calf.birthDate
      ? moment(calf.birthDate).format("DD/MM/YYYY")
      : "No registrado";
    document.getElementById("calfGender").textContent =
      calf.gender || "No especificado";
    document.getElementById("calfWeight").textContent =
      calf.calfWeight || "No registrado";
    document.getElementById("calfCalostro").textContent =
      calf.calfCalostro || "No registrado";
    document.getElementById("calfMother").textContent =
      calf.mother || "No registrada";

    calfInfo.classList.remove("hidden");

    // Generar botones de protocolos
    protocolsButtons.innerHTML = "";
    protocols.forEach((protocol) => {
      const isCompleted =
        calf.vacunation &&
        calf.vacunation.some(
          (vac) => vac.protocolId.toString() === protocol._id
        );
      const button = document.createElement("button");
      button.textContent = protocol.name;
      button.classList.add("protocol-button");

      if (isCompleted) {
        button.classList.add("completed");
        button.innerHTML += " ✓";
        button.disabled = true;
      } else {
        button.addEventListener("click", () =>
          handleVacunation(protocol._id, calfId)
        );
      }

      protocolsButtons.appendChild(button);
    });

    protocolsSection.classList.remove("hidden");
  } catch (error) {
    console.error("Error al cargar ternero:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo cargar la información del ternero." + error.message,
    });
  }
});

async function handleVacunation(protocolId, calfId) {
  const { value: date } = await Swal.fire({
    title: "Registrar Vacunación",
    html:
      '<input id="swal-input-date" type="date" class="swal2-input" value="' +
      moment().format("YYYY-MM-DD") +
      '">',
    focusConfirm: false,
    preConfirm: () => {
      return document.getElementById("swal-input-date").value;
    },
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  });

  if (date) {
    try {
      const response = await fetch(`/calf/vacunation/${calfId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protocolId, date: moment(date).toDate() }),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Vacunación registrada",
        }).then(() => {
          calfSelect.dispatchEvent(new Event("change")); // Recargar ficha
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "No se pudo registrar.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error inesperado, intenta más tarde.",
      });
    }
  }
}
