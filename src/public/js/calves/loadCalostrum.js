document.querySelectorAll(".load-calostrum-button").forEach((button) => {
    button.addEventListener("click", function () {
      const calfId = this.getAttribute("data-id");
      
      Swal.fire({
        title: "Cargar el calostrado del ternero, ATENCION, NO SE PUEDE MODIFICAR, CARGAR CON CUIDADO.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        html: `
        <input id="calostrum" name="calostrum" type="text" placeholder="Colocar el resultado(número)" style="width: 100%; margin-top: 10px;">
        `,
        preConfirm: () => {
           return {
            calostrum: document.getElementById('calostrum').value
        };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const calostrum = result.value.calostrum;
          console.log(calostrum)
          const form = document.querySelector(`form[action="/calf/calostrum/${calfId}"]`);
          const calostrumInput = document.createElement('input');
            calostrumInput.type = 'hidden';
            calostrumInput.name = 'calostrumInput';
            calostrumInput.value = calostrum;
          form.appendChild(calostrumInput);
                
          // Enviar el formulario
          form.submit();
        }
      });
    });
  });
  