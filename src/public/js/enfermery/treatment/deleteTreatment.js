const nameInputDeleteTreatment = document.getElementById("nameDeleteTreatment")
const idInputDeleteTreatment = document.getElementById("idInputDeleteTreatment")

function updateDeleteFormInfo() {
    const selectedOption = nameInputDeleteTreatment[nameInputDeleteTreatment.selectedIndex]
    const _id = selectedOption.getAttribute("_id")
    idInputDeleteTreatment.value = _id
}

nameInputDeleteTreatment.addEventListener("change", updateDeleteFormInfo)

const deleteTreatmentFormSubmit = document.getElementById("deleteTreatmentFormSubmit")
 

deleteTreatmentFormSubmit.addEventListener("submit", function (e) {
    e.preventDefault();

    const cid = idInputDeleteTreatment.value; 

    fetch("/treatment/delete" + cid, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar el ternero");
        }
       
        window.location.href = "/enfermeria"; 
    })
    .catch(error => {
        console.error("Error:", error);
    });
});