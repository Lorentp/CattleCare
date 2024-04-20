document.querySelectorAll(".mark-dead-calf").forEach((button) => {
    button.addEventListener("click", function () {
      const calfId = this.getAttribute("data-id");
      Swal.fire({
        title: "¿El ternero ha muerto ó quieres darlo de baja?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          document
            .querySelector(`form[action="/calf/dead/${calfId}"]`)
            .submit();
        }
      });
    });
  });
  