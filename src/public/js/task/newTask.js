const addScheduleForm = document.getElementById("addScheduleForm")

addScheduleForm.addEventListener("submit", async function (e) {
    e.preventDefault()


    const formData = new FormData(this)
    const formObject = Object.fromEntries(formData.entries())

    try {
        const response = await fetch ("/schedule/add", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(formObject)
       })

       if(response.status === 200 || response.status === 201){
        Swal.fire({
            icon: "success",
            title: "Tarea guardada correctamente",
        }).then(() => {
            window.location.href = "/terneros";
          });
       } else {
        Swal.fire({
            icon: "error",
            title:"Error",
            text:"Ha ocurrido un error al generar la tarea, intententelo de nuevo"
        })
       }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ha ocurrido un error, intenta más tarde",
        })
        console.error(error);
    }
})
