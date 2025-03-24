const nameInputDeleteTreatment = document.getElementById("nameDeleteTreatment")
const idInputDeleteTreatment = document.getElementById("idInputDeleteTreatment")

function updateDeleteFormInfo() {
    const selectedOption = nameInputDeleteTreatment[nameInputDeleteTreatment.selectedIndex]
    const _id = selectedOption.getAttribute("_id")
    idInputDeleteTreatment.value = _id
}

nameInputDeleteTreatment.addEventListener("change", updateDeleteFormInfo)

const deleteTreatmentFormSubmit = document.getElementById("deleteTreatmentFormSubmit")
 

deleteTreatmentFormSubmit.addEventListener("submit", async function (e) {
    e.preventDefault();

    const cid = idInputDeleteTreatment.value; 
    
    try {
        const response = await fetch("/treatment/delete/" + cid, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            }
        })

        const result = await response.json();

        if(response.status === 200 && result.success) {
            Swal.fire({
                icon:"success",
                title: "Tratamiento eliminado con exito"
            }).then(() => {
                window.location.href = "/enfermeria"
            })
        } else {
            Swal.fire({
                icon:"error",
                title: "Error",
                text: "Ha ocurrido un error"
            })
        }

        
    } catch (error) {
        console.log(error)
    }   
});