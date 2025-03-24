const nameDeleteTask = document.getElementById("nameDeleteTask")
const idInputDeleteTask = document.getElementById("idInputDeleteTask")

function updateDeleteTaskFormInfo() {
    const selectedOption = nameDeleteTask[nameDeleteTask.selectedIndex]
    const _id = selectedOption.getAttribute("_id")
    
    idInputDeleteTask.value = _id
}

nameDeleteTask.addEventListener("change", updateDeleteTaskFormInfo)

const deleteTaskFormSubmit = document.getElementById("deleteTaskFormSubmit")
 

deleteTaskFormSubmit.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
        _id: idInputDeleteTask.value,
        title: nameDeleteTask.value
    }

    const confirmResult = await Swal.fire({
        icon: "warning",
        text: "¿Deseas eliminar la tarea?",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6"
    })

    if(confirmResult.isConfirmed) {
        try {
            const response = await fetch("/schedule/delete/" + formData._id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",                    
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()
            if(response.status === 200 && result.success){
                Swal.fire({
                    icon:"success",
                    title:" Tarea eliminada con exito"
                }).then(() => {
                    window.location.href = "/terneros"
                })
            } else {
                Swal.fire({
                    icon:"error",
                    title:"Error",
                    text: result.message || "Ha ocurrido un error al eliminar la tarea"
                })
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al conectar con el servidor",
        });
        }
    }
});