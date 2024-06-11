/*Form para actualizar*/

const nameInputUpdateTreatment = document.getElementById("nameInputUpdateTreatment")
const medicationUpdateTratment = document.getElementById("medicationUpdateTreatment")
const durationUpdateTreatment = document.getElementById("durationUpdateTreatment")
const idInputUpdateTreatment = document.getElementById("idInputUpdateTreatment")

function updateTreatmentFormInfo() {
    
    const selectedOption = nameInputUpdateTreatment[nameInputUpdateTreatment.selectedIndex]
    const medication = selectedOption.getAttribute("medication")
    const duration = selectedOption.getAttribute("data-duration")
    const _id = selectedOption.getAttribute("_id")

    medicationUpdateTratment.value = medication
    durationUpdateTreatment.value = duration
    idInputUpdateTreatment.value = _id 
}

nameInputUpdateTreatment.addEventListener("change", updateTreatmentFormInfo)