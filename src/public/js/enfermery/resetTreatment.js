const newTreatment = document.getElementById("resetTreatmentCalf");
const newTitleInput = document.getElementById("newTitleInput");
const newMedicationInput = document.getElementById("newMedicationInput");
const newDurationInput = document.getElementById("newDurationInput");

function resetTreatmentFormInfo() {
    const selectedOption = newTreatment.options[newTreatment.selectedIndex];
    const title = selectedOption.getAttribute("data-title") || "";
    const medication = selectedOption.getAttribute("data-medication") || "";
    const duration = selectedOption.getAttribute("data-duration") || "";
    
    newTitleInput.value = title;
    newMedicationInput.value = medication; 
    newDurationInput.value = duration;
}

if (newTreatment) {
    newTreatment.addEventListener("change", resetTreatmentFormInfo);
} else {
    console.error("El elemento 'resetTreatmentCalf' no se encontró en el DOM");
}