document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".release-calf-button");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const calfId = this.getAttribute("data-id");
      const today = new Date().toISOString().split("T")[0];
      Swal.fire({
        title:
          "Desea largar este ternero a la recria, coloque el peso por favor",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        html: `
          <input id="weightReleased" name="weightReleased" type="number" placeholder="Colocar el peso en kilos(número)" style="width: 100%; margin-top: 10px;" required>
          <input id="releaseDate" name="releaseDate" type="date" value="${today}" style="width: 100%; margin-top: 10px;" required>
        `,
        preConfirm: () => {
          const weight = document.getElementById("weightReleased").value;
          const releaseDate = document.getElementById("releaseDate").value;

          if (!weight || isNaN(weight) || weight <= 0) {
            Swal.showValidationMessage(
              "Por favor, ingrese un peso válido mayor a 0"
            );
            return false;
          }
          if (!releaseDate) {
            Swal.showValidationMessage(
              "Por favor, seleccione una fecha válida"
            );
            return false;
          }
          return { weightReleased: weight, whenReleased: releaseDate };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const releasedWeight = result.value.weightReleased;
          const whenReleased = result.value.whenReleased;
          console.log(
            "Peso confirmado:",
            releasedWeight,
            "Fecha:",
            whenReleased
          );

          const form = document.querySelector(
            `form[action="/calf/released/${calfId}"]`
          );
          if (!form) {
            console.error("Formulario no encontrado para el ID:", calfId);
            return;
          }

          const formData = new URLSearchParams();
          formData.append("releasedWeight", releasedWeight);
          formData.append("whenReleased", whenReleased);

          console.log("Datos enviados al servidor:", formData.toString());

          fetch(form.action, {
            method: form.method,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                Swal.fire({
                  icon: "success",
                  title: "Ternero liberado exitosamente",
                }).then(() => {
                  window.location.href = "/terneros-guachera";
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: data.message || "Intentelo de nuevo",
                });
              }
            })
            .catch((error) => {
              console.error("Error en fetch:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al procesar la solicitud.",
              });
            });
        }
      });
    });
  });
});
