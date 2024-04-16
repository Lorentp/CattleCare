const newTreatment = document.getElementById("resetTreatmentCalf")
const newMedicationInput = document.getElementById("newMedicationInput")
const newDurationInput = document.getElementById("newDurationInput")

function resetTreatmentFormInfo() {
    const selectedOption = newTreatment[newTreatment.selectedIndex]
    const medication = selectedOption.getAttribute("medication")
    const duration = selectedOption.getAttribute("data-duration")
    newMedicationInput.value = medication
    newDurationInput.value = duration
    
}

newTreatment.addEventListener("change", resetTreatmentFormInfo)