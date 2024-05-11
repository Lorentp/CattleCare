const nameDeleteTask = document.getElementById("nameDeleteTask")
const idInputDeleteTask = document.getElementById("idInputDeleteTask")

function updateDeleteTaskFormInfo() {
    const selectedOption = nameDeleteTask[nameDeleteTask.selectedIndex]
    const _id = selectedOption.getAttribute("_id")
    
    idInputDeleteTask.value = _id
}

nameDeleteTask.addEventListener("change", updateDeleteTaskFormInfo)

const deleteTaskFormSubmit = document.getElementById("deleteTaskFormSubmit")
 

deleteTaskFormSubmit.addEventListener("submit", function (e) {
    e.preventDefault();

    const cid = idInputDeleteTask.value; 

    fetch("/schedule/delete" + cid, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar el ternero");
        }
       
        window.location.href = "/home"; 
    })
    .catch(error => {
        console.error("Error:", error);
    });
});