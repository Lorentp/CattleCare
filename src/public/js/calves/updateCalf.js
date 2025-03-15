const nameInputUpdateCalfName = document.getElementById("nameUpdateCalfName");
const idInputCalfName = document.getElementById("idInputCalfName");
const newNameInput = document.getElementById("newName");
const newBirthTypeSelect = document.querySelector(
  'select[name="newBirthType"]'
);
const newGenderSelect = document.querySelector('select[name="newGender"]');
const newBirthDateInput = document.getElementById("newBirthDate");
const newWeighInput = document.getElementById("newWeigh");
const newCalotrumInput = document.getElementById("newCalotrum");

function formatDateToISO(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateFormInfo() {
  const selectedOption =
    nameInputUpdateCalfName[nameInputUpdateCalfName.selectedIndex];

  // Obtener todos los datos del ternero seleccionado
  const _id = selectedOption.getAttribute("_id");
  const name = selectedOption.getAttribute("name");
  const birthType = selectedOption.getAttribute("data-birth-type");
  const gender = selectedOption.getAttribute("data-gender");
  const birthDate = selectedOption.getAttribute("data-birth-date");
  const weight = selectedOption.getAttribute("data-weight");
  const calotrum = selectedOption.getAttribute("data-calotrum");

  // Actualizar todos los campos del formulario
  idInputCalfName.value = _id || "";
  newNameInput.value = name || "";
  newBirthTypeSelect.value = birthType || "";
  newGenderSelect.value = gender || "";
  newBirthDateInput.value = birthDate ? formatDateToISO(birthDate) : "";
  newWeighInput.value = weight || "";
  newCalotrumInput.value = calotrum || "";
}

nameInputUpdateCalfName.addEventListener("change", updateFormInfo);

const updaCalfNameFormData = document.getElementById("updateCalfNameFormData");

updaCalfNameFormData.addEventListener("submit", async function (e) {
  e.preventDefault();

  let formData = {
    _id: idInputCalfName.value,
    name: newNameInput.value,
    birthType: newBirthTypeSelect.value,
    gender: newGenderSelect.value,
    birthDate: newBirthDateInput.value,
    calfWeight: newWeighInput.value,
    calfCalostro: newCalotrumInput.value,
  };
  try {
    const response = await fetch("/calf/updatename/" + formData._id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.status === 200 && result.success) {
      Swal.fire({
        icon: "success",
        title: "Ternero actualizado con exito",
      }).then(() => {
        window.location.href = "/terneros";
      });
    } else if (response.status === 409) {
      Swal.fire({
        icon: "error",
        title: "Ya existe un ternero con esta caravana",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "Ha ocurrido un error al actualizar el ternero",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
