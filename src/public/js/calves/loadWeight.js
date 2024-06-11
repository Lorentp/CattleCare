document.querySelectorAll(".load-weight-button").forEach((button) => {
    button.addEventListener("click", function () {
      const calfId = this.getAttribute("data-id");
      Swal.fire({
        title: "Cargar el peso del ternero, ATENCION, NO SE PUEDE MODIFICAR, CARGAR CON CUIDADO.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        html: `
        <input id="weight" name="weight" type="text" placeholder="Colocar el peso en kilos(número)" style="width: 100%; margin-top: 10px;">
        `,
        preConfirm: () => {
           return {
             weight: document.getElementById('weight').value
        };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const weight = result.value.weight;
          console.log(weight)
          const form = document.querySelector(`form[action="/calf/weigh/${calfId}"]`);
          const weightInput = document.createElement('input');
            weightInput.type = 'hidden';
            weightInput.name = 'weightInput';
            weightInput.value = weight;
          form.appendChild(weightInput);
                
          // Enviar el formulario
          form.submit();
        }
      });
    });
  });
  