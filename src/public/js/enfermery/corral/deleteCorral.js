const nameInputDeleteCorral = document.getElementById("nameDeleteCorral")
const idInputDeleteCorral = document.getElementById("idInputDeleteCorral")

function updateDeleteFormInfo() {
    const selectedOption = nameInputDeleteCorral[nameInputDeleteCorral.selectedIndex]
    const _id = selectedOption.getAttribute("_id")
    
    idInputDeleteCorral.value = _id
}

nameInputDeleteCorral.addEventListener("change", updateDeleteFormInfo)

const deleteCorralFormSubmit = document.getElementById("deleteCorralFormSubmit")
 

deleteCorralFormSubmit.addEventListener("submit", function (e) {
    e.preventDefault();

    const cid = idInputDeleteCorral.value; 

    fetch("/corral/delete" + cid, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar el ternero");
        }
       
        window.location.href = "/home"; 
    })
    .catch(error => {
        console.error("Error:", error);
    });
});