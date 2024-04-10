const addCalfButton = document.getElementById("addCalfButton");
const updateCalfButton = document.getElementById("updateCalfButton");
const deleteCalfButton = document.getElementById("deleteCalfButton");
const addTreatmentButton = document.getElementById("addTreatmentButton");
const updateTreatmentButton = document.getElementById("updateTreatmentButton");
const deleteTreatmentButton = document.getElementById("deleteTreatmentButton");
const addCorralButton = document.getElementById("addCorralButton")
const deleteCorralButton = document.getElementById("deleteCorralButton")

const addCalfForm = document.getElementById("addCalfForm");
const updateCalfForm = document.getElementById("updateCalfForm");
const deleteCalfForm = document.getElementById("deleteCalfForm");
const addTreatmentForm = document.getElementById("addTreatmentForm");
const updateTreatmentForm = document.getElementById("updateTreatmentForm");
const deleteTreatmentForm = document.getElementById("deleteTreatmentForm");
const addCorralForm = document.getElementById("addCorralForm")
const deleteCorralForm = document.getElementById("deleteCorralForm")


function showOrHideElement(e) {
    if(e.classList.contains("hidden")) {
        e.classList.remove("hidden")
    } else{
        e.classList.add("hidden");
    }
}

function activeButton(button) {
    button.classList.toggle('active')
   
}

addCalfButton.addEventListener("click", function() {
    showOrHideElement(addCalfForm);
    activeButton(this)
});

updateCalfButton.addEventListener("click", function() {
    showOrHideElement(updateCalfForm);
    activeButton(this)
});

deleteCalfButton.addEventListener("click", function() {
    showOrHideElement(deleteCalfForm);
    activeButton(this)
});

addTreatmentButton.addEventListener("click", function() {
    showOrHideElement(addTreatmentForm);
    activeButton(this)
});

updateTreatmentButton.addEventListener("click", function() {
    showOrHideElement(updateTreatmentForm);
    activeButton(this)
});

deleteTreatmentButton.addEventListener("click", function() {
    showOrHideElement(deleteTreatmentForm);
    activeButton(this)
});

addCorralButton.addEventListener("click", function() {
    showOrHideElement(addCorralForm);
    activeButton(this)
});
deleteCorralButton.addEventListener("click", function() {
    showOrHideElement(deleteCorralForm);
    activeButton(this)
});