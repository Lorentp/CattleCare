document
  .getElementById("addCalfForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const fObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/calf/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fObject),
      });

      const result = await response.json();

      if (response.status === 201 && result.success) {
        Swal.fire({
          icon: "success",
          title: "Ternero generado con exito",
        }).then(() => {
          window.location.href = "/terneros";
        });
      } else if (response.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "El ternero ya existe, intentelo de nuevo por favor",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error, intentelo de nuevo",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error, intente mas tarde",
      });
      console.error(error);
    }
  });
