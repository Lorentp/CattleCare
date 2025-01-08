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

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Ternero generado con exito",
          text: result.message,
        }).then(() => {
          window.location.href = "/terneros";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Ha ocurrido un error, intentelo nuevamente",
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
