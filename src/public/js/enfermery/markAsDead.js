document.querySelectorAll(".mark-dead-calf").forEach((button) => {
  button.addEventListener("click", function () {
    const calfId = this.getAttribute("data-id");
    const today = new Date().toISOString().split("T")[0]; // Fecha actual en YYYY-MM-DD

    Swal.fire({
      title: "¿El ternero ha muerto o quieres darlo de baja?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      html: `
        <input id="comment" name="comment" type="text" placeholder="Agregar comentario" style="width: 100%; margin-top: 10px;">
        <input id="timeDead" name="timeDead" type="date" value="${today}" style="width: 100%; margin-top: 10px;" required>
      `,
      preConfirm: () => {
        const comment = document.getElementById("comment").value;
        const timeDead = document.getElementById("timeDead").value;

        if (!timeDead) {
          Swal.showValidationMessage("Por favor, seleccione una fecha válida");
          return false;
        }

        return {
          comment: comment,
          timeDead: timeDead,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const comment = result.value.comment;
        const timeDead = result.value.timeDead;
        console.log("Comentario:", comment, "Fecha de muerte:", timeDead);

        const form = document.querySelector(
          `form[action="/calf/dead/${calfId}"]`
        );
        if (!form) {
          console.error("Formulario no encontrado para el ID:", calfId);
          return;
        }

        // Crear un objeto URLSearchParams para enviar como urlencoded
        const formData = new URLSearchParams();
        formData.append("comment", comment);
        formData.append("timeDead", timeDead);

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
                title: "Ternero dado de baja exitosamente",
              }).then(() => {
                // Redirigir según la página de origen
                const referer = document.referrer;
                if (
                  referer &&
                  referer.includes("/enfermeria/terneros-en-tratamiento")
                ) {
                  window.location.href = "/enfermeria/terneros-en-tratamiento";
                } else if (referer && referer.includes("/enfermeria/corral/")) {
                  const dynamicRouteId = referer.split("/").pop();
                  window.location.href = `/enfermeria/corral/${dynamicRouteId}`;
                } else if (
                  referer &&
                  referer.includes(
                    "/enfermeria/terneros-por-terminar-tratamiento"
                  )
                ) {
                  window.location.href =
                    "/enfermeria/terneros-por-terminar-tratamiento";
                } else {
                  window.location.href = "/terneros-guachera";
                }
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
