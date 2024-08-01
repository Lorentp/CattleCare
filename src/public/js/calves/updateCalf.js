const nameInputUpdateCalfName = document.getElementById("nameUpdateCalfName");
const idInputCalfName = document.getElementById("idInputCalfName");
const newNameInput = document.getElementById("newName");

function updateFormInfo() {
  const selectedOption =
    nameInputUpdateCalfName[nameInputUpdateCalfName.selectedIndex];
  const _id = selectedOption.getAttribute("_id");
  const name = selectedOption.getAttribute("name");

  idInputCalfName.value = _id;
  newNameInput.value = name;
}

nameInputUpdateCalfName.addEventListener("change", updateFormInfo);

const updaCalfNameFormData = document.getElementById("updateCalfNameFormData");

updaCalfNameFormData.addEventListener("submit", function (e) {
  e.preventDefault();

  let formData = {
    _id: idInputCalfName.value,
    name: newNameInput.value,
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
