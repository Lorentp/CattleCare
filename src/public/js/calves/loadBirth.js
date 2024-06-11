document.querySelectorAll(".load-birth-button").forEach((button) => {
    button.addEventListener("click", function () {
      const calfId = this.getAttribute("data-id");
      
      Swal.fire({
        title: "Cargar la fecha de nacimiento del ternero, ATENCION, NO SE PUEDE MODIFICAR, CARGAR CON CUIDADO.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        html: `
        <input id="birth" name="birthDate" type="date" style="width: 100%; margin-top: 10px;">
        `,
        preConfirm: () => {    
            const birthValue = document.getElementById('birth').value;
            const birthDateLocal = moment(birthValue).format("YYYY-MM-DD")
            return{
                birth: birthDateLocal
            }
        
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const birthDate = result.value.birth;
          console.log(birth)
          const form = document.querySelector(`form[action="/calf/birth/${calfId}"]`);
          const birthInput = document.createElement('input');
            birthInput.type = 'hidden';
            birthInput.name = 'birthDate';
            birthInput.value = birthDate;
          form.appendChild(birthInput);
                
          // Enviar el formulario
          form.submit();
        }
      });
    });
  });