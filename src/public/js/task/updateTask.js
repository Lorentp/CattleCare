/*Form para actualizar*/

const nameInputUpdateSchedule = document.getElementById("nametInputUpdateSchedule");
const taskOneUpdateInput = document.getElementById("taskOneUpdateInput");
const taskTwoUpdateInput = document.getElementById("taskTwoUpdateInput");
const taskThreeUpdateInput = document.getElementById("taskThreeUpdateInput");
const taskFourUpdateInput = document.getElementById("taskFourUpdateInput");
const taskFiveUpdateInput = document.getElementById("taskFiveUpdateInput");
const taskSixUpdateInput = document.getElementById("taskSixUpdateInput");
const taskSevenUpdateInput = document.getElementById("taskSevenUpdateInput");
const taskEightUpdateInput = document.getElementById("taskEightUpdateInput");
const updateTaksIdInput = document.getElementById("updateTaksIdInput");


function updateTasksFormInfo(){
    const selectedOption = nameInputUpdateSchedule[nameInputUpdateSchedule.selectedIndex]
    const taskOne = selectedOption.getAttribute("taskOne")
    const taskTwo = selectedOption.getAttribute("taskTwo")
    const taskThree = selectedOption.getAttribute("taskThree")
    const taskFour = selectedOption.getAttribute("taskFour")
    const taskFive = selectedOption.getAttribute("taskFive")
    const taskSix = selectedOption.getAttribute("taskSix")
    const taskSeven = selectedOption.getAttribute("taskSeven")
    const taskEight = selectedOption.getAttribute("taskEight")
    const _id = selectedOption.getAttribute("_id")

    updateTaksIdInput.value = _id
    taskOneUpdateInput.value = taskOne
    if(taskTwo){
        taskTwoUpdateInput.value = taskTwo
    }
    if(taskThree){
        taskThreeUpdateInput.value = taskThree
    }
    if(taskFour){
        taskFourUpdateInput.value = taskFour
    }
    if(taskFive){
        taskFiveUpdateInput.value = taskFive
    }
    if(taskSix){
        taskSixUpdateInput.value = taskSix
    }
    if(taskSeven){
        taskSevenUpdateInput.value = taskSeven
    }
    if(taskEight){
        taskEightUpdateInput.value = taskEight
    }   
}

nameInputUpdateSchedule.addEventListener("change", updateTasksFormInfo)

//Router

const updateScheduleFormData = document.getElementById("updateScheduleFormData")

updateScheduleFormData.addEventListener("submit", async function(e) {
    e.preventDefault()

    let formData = {
    _id: updateTaksIdInput.value, 
    taskOne: taskOneUpdateInput.value,
    taskTwo: taskTwoUpdateInput.value,
    taskThree: taskThreeUpdateInput.value,
    taskFour: taskFourUpdateInput.value,
    taskFive: taskFiveUpdateInput.value,
    taskSix: taskSixUpdateInput.value,
    taskSeven: taskSevenUpdateInput.value,
    taskEight: taskEightUpdateInput.value
    }
    
    try {
        const response = await fetch("/schedule/update/" + formData._id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        const result = await response.json()

        if(response.status === 200 && result.success) {
            Swal.fire ({
                icon:"success",
                title:"Tarea actualizada con exito",
            }).then(() => {
                window.location.href = "/terneros"
            })
        } else {
            Swal.fire ({
                icon:"error",
                title:"Error",
                text: result.message || "Ha ocurrido un error al actualizar la tarea"
            })
        }
    } catch (error) {
        console.log(error)
        Swal.fire({
            icon: "error",
            title:"Error",
            text: "Error de servidor, intente de nuevo o revise su conexion a internet"
        })
    }
})