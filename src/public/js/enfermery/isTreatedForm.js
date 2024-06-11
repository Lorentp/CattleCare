document.querySelectorAll(".mark-today-treated").forEach((button) => {
  button.addEventListener("click", function () {
    const calfId = this.getAttribute("data-id");
    Swal.fire({
      title: "¿El ternero fue tratado?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        document
          .querySelector(`form[action="/calf/treated/${calfId}"]`)
          .submit();
      }
    });
  });
});
