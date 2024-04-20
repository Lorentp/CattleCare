const updateCalfFormData = document.getElementById("updateCalfFormData")

updateCalfFormData.addEventListener("submit", function(e) {
    e.preventDefault()

    let formData = {
    _id: document.getElementById("idInputCalf").value, 
    name: document.getElementById("nameUpdateCalf").value,
    corral:document.getElementById("corralUpdateCalf").value,
    corralId: document.getElementById("idInputCorralCalf").value,
    startDate: document.getElementById("startDateUpdateCalf").value,
    treatment: document.getElementById("treatmentUpdateCalf").value,
    medication: document.getElementById("medicationUpdateCalf").value,
    duration: document.getElementById("durationUpdateCalf").value,
    endDate: document.getElementById("endDateUpdateCalf").value}

    fetch("/calf/update" + formData._id, {
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