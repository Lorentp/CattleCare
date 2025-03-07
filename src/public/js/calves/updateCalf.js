const nameInputUpdateCalfName = document.getElementById("nameUpdateCalfName");
const idInputCalfName = document.getElementById("idInputCalfName");
const newNameInput = document.getElementById("newName");
const newBirthTypeSelect = document.querySelector('select[name="newBirthType"]');
const newGenderSelect = document.querySelector('select[name="newGender"]');
const newBirthDateInput = document.getElementById("newBirthDate");
const newWeighInput = document.getElementById("newWeigh");
const newCalotrumInput = document.getElementById("newCalotrum");

function formatDateToISO(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Si la fecha no es válida, retorna vacío
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth empieza en 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function updateFormInfo() {
  const selectedOption = nameInputUpdateCalfName[nameInputUpdateCalfName.selectedIndex];
  
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

updaCalfNameFormData.addEventListener("submit", function (e) {
  e.preventDefault();

  let formData = {
    _id: idInputCalfName.value,
    name: newNameInput.value,
    birthType: newBirthTypeSelect.value,
    gender: newGenderSelect.value,
    birthDate: newBirthDateInput.value,
    calfWeight: newWeighInput.value,
    calfCalostro: newCalotrumInput.value
  };

  fetch("/calf/updatename/" + formData._id, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al actualizar el ternero");
      }
      window.location.href = "/terneros";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});