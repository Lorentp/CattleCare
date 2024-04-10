const resetTreatmentForm = document.getElementById("resetTreatmentForm")

resetTreatmentForm.addEventListener("submit", function(e) {
    e.preventDefault()

    let formData = {
    _id: document.getElementById("idInputResetTreatment").value,
    }
    fetch("/calf/resetTreatment", {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
          throw new Error("Error al actualizar el ternero");
        }
       
        window.location.href = "/home"; 
      })
      .catch(error => {
        console.error("Error:", error);
       
      });
})