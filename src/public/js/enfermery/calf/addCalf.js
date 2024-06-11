
/*Form para agregar terneros*/ 
const treatment= document.getElementById('treatment')
const startDateInput = document.getElementById("startDate")
const infoTreatment = document.getElementById("infoTreatment")
const durationInput = document.getElementById("duration")
const endDateInput = document.getElementById("endDate")
const medicationInput = document.getElementById("medication")
const corral = document.getElementById("corral")
const corralIdInput = document.getElementById("corralIdInput")

function updateCorralInfo(){
  const selectedOption = corral.options[corral.selectedIndex]
  const corralId = selectedOption.getAttribute("corralId")
  corralIdInput.value = corralId
}


function calculateEndDate(startDate, duration) {
  const startDateObj = new Date(startDate)
  const endDateObj = new Date(startDateObj.getTime() + (duration) * 24 * 60 * 60 * 1000)
  return endDateObj.toLocaleDateString()
}

function updateTreatmentInfo() {
  const selectedOption = treatment.options[treatment.selectedIndex]
  const durationDays = selectedOption.getAttribute("data-duration");
  const medication = selectedOption.getAttribute("medication")
  const duration = parseInt(selectedOption.getAttribute("data-duration"), 10)
  const startDate = new Date (startDateInput.value)

  if(startDate && !isNaN(duration)) {
    const endDate = new Date(startDate.getTime())
    endDate.setDate(endDate.getDate() + (duration - 1))
    const formattedEndDate = endDate.toISOString().slice(0, 10);
    durationInput.value = duration
    endDateInput.value = formattedEndDate
    medicationInput.value = medication 
  } else {
    durationInput.value = ""
    endDateInput.value = ""         
  }
}


treatment.addEventListener("change", updateTreatmentInfo);
startDateInput.addEventListener("change", updateTreatmentInfo);
corral.addEventListener("change", updateCorralInfo)


