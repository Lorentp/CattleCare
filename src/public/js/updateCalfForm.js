
/*Form para actualizar*/ 
const nameInputUpdateCalf = document.getElementById("nameUpdateCalf")
const treatmentUpdateCalf = document.getElementById("treatmentUpdateCalf")
const startDateInputUpdateCalf = document.getElementById("startDateUpdateCalf")
const infoTreatmentUpdateCalf = document.getElementById("infoTreatmentUpdateCalf")
const durationInputUpdateCalf = document.getElementById("durationUpdateCalf")
const endDateInputUpdateCalf = document.getElementById("endDateUpdateCalf")
const medicationInputUpdateCalf = document.getElementById("medicationUpdateCalf")
const idInputCalf = document.getElementById("idInputCalf")




function calculateEndDateUpdate(startDate, duration) {
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(startDateObj.getTime() + (duration) * 24 * 60 * 60 * 1000)
    return endDateObj.toLocaleDateString()
}

function updateFormInfo() {
    const selectedOption = nameInputUpdateCalf[nameInputUpdateCalf.selectedIndex]
    const startDate = selectedOption.getAttribute("start-date")
    const treatment = selectedOption.getAttribute("treatment")
    const _id = selectedOption.getAttribute("_id")
    const startDateFormatted =  new Date(startDate)

    startDateInputUpdateCalf.value = startDateFormatted.toISOString().slice(0, 10)
    treatmentUpdateCalf.value = treatment
    idInputCalf.value = _id
    
    updateTreatmentInfoUpdate();
}

function updateTreatmentInfoUpdate() {
    
    const selectedOption = treatmentUpdateCalf.options[treatmentUpdateCalf.selectedIndex]
    const medication = selectedOption.getAttribute("medication")
    const duration = parseInt(selectedOption.getAttribute("data-duration"), 10)
    const startDate = new Date (startDateInputUpdateCalf.value)
    
    if(startDate && !isNaN(duration)) {
        const endDate = new Date(startDate.getTime())
        endDate.setDate(endDate.getDate() + (duration - 1))
        const formattedEndDate = endDate.toISOString().slice(0, 10);
        durationInputUpdateCalf.value = duration
        endDateInputUpdateCalf.value = formattedEndDate
        medicationInputUpdateCalf.value = medication 
    } else {
        durationInputUpdateCalf.value = ""
        endDateInputUpdateCalf.value = "" 
        medicationInputUpdateCalf.value= ""        
    }
}


nameInputUpdateCalf.addEventListener("change", updateFormInfo)
treatmentUpdateCalf.addEventListener("change", updateTreatmentInfoUpdate);
startDateInputUpdateCalf.addEventListener("change", updateTreatmentInfoUpdate);