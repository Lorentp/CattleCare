document.querySelectorAll(".reset-button").forEach((button) => {
  button.addEventListener("click", function () {
    Swal.fire({
      title: "¿Estás seguro que deseas reiniciar el tratamiento?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector(`form[action="/calf/resetTreatment"]`).submit();
      }
    });
  });
});
document.querySelectorAll(".finish-button").forEach((button) => {
  button.addEventListener("click", function () {
    Swal.fire({
      title: "¿Estás seguro que deseas finalizar el tratamiento?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector(`form[action="/calf/finishTreatment"]`).submit();
      }
    });
  });
});
