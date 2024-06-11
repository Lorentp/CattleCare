document.querySelectorAll(".mark-dead-calf").forEach((button) => {
    button.addEventListener("click", function () {
      const calfId = this.getAttribute("data-id");
      Swal.fire({
        title: "¿El ternero ha muerto ó quieres darlo de baja?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        html: `
        <input id="comment" name="comment" type="text" placeholder="Agregar comentario" style="width: 100%; margin-top: 10px;">
        `,
        preConfirm: () => {
           return {
             comment: document.getElementById('comment').value
        };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const comment = result.value.comment;
          console.log(comment)
          const form = document.querySelector(`form[action="/calf/dead/${calfId}"]`);
          const commentInput = document.createElement('input');
              commentInput.type = 'hidden';
              commentInput.name = 'comment';
              commentInput.value = comment;
          form.appendChild(commentInput);
                
          // Enviar el formulario
          form.submit();
        }
      });
    });
  });
  