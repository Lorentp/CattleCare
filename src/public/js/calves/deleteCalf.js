const nameInputDeleteCalf = document.getElementById("nameDeleteCalf");
const idInputDeleteCalf = document.getElementById("idInputDeleteCalf");

function updateDeleteFormInfo() {
  const selectedOption = nameInputDeleteCalf[nameInputDeleteCalf.selectedIndex];
  const _id = selectedOption.getAttribute("_id");

  idInputDeleteCalf.value = _id;
}

nameInputDeleteCalf.addEventListener("change", updateDeleteFormInfo);

const deleteCalfFormSubmit = document.getElementById("deleteCalfFormSubmit");

deleteCalfFormSubmit.addEventListener("submit", async function (e) {
  e.preventDefault();

  const cid = idInputDeleteCalf.value;
  try {
    const response = await fetch("/calf/delete/" + cid, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.status === 200 && result.success) {
      Swal.fire({
        icon: "success",
        title: "Ternero eliminado con exito",
      }).then(() => {
        window.location.href = "/terneros";
      });
    } else if (response.status === 404) {
      Swal.fire({
        icon: "error",
        title: "Error",
        message: result.message || "El ternero no existe",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "Ha ocurrido un error al eliminar el ternero",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
