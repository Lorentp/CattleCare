const updateTreatmentFormData = document.getElementById("updateTreatmentFormData")

updateTreatmentFormData.addEventListener("submit", function(e) {
    e.preventDefault()

    let formData = {
    _id: document.getElementById("idInputUpdateTreatment").value, 
    name: document.getElementById("nameInputUpdateTreatment").value,
    medication: document.getElementById("medicationUpdateTreatment").value,
    duration: document.getElementById("durationUpdateTreatment").value,
    }
    fetch("/treatment/update" + formData._id, {
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