const nameInputDeleteCalf = document.getElementById("nameDeleteCalf")
const idInputDeleteCalf = document.getElementById("idInputDeleteCalf")

function updateDeleteFormInfo() {
    const selectedOption = nameInputDeleteCalf[nameInputDeleteCalf.selectedIndex]
    const _id = selectedOption.getAttribute("_id")

    idInputDeleteCalf.value = _id
}

nameInputDeleteCalf.addEventListener("change", updateDeleteFormInfo)

const deleteCalfFormSubmit = document.getElementById("deleteCalfFormSubmit")
 

deleteCalfFormSubmit.addEventListener("submit", function (e) {
    e.preventDefault();

    const cid = idInputDeleteCalf.value; 

    fetch("/calf/delete" + cid, { 
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