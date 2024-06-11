document.querySelectorAll(".stop-milking-button").forEach((button) => {
  button.addEventListener("click", function () {
    const calfId = this.getAttribute("data-id");
    Swal.fire({
      title: "¿Estás seguro que deseas comenzar desleche?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector(`form[action="/stopMilking/calf/${calfId}"]`).submit();
      }
    });
  });
});