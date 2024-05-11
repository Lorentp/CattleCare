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

updateScheduleFormData.addEventListener("submit", function(e) {
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
    fetch("/schedule/update" + formData._id, {
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