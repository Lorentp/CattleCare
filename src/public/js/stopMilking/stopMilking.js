


const createProtocol = document.getElementById('stopMilkingProtocolDuration')
const deletedProtocol = document.getElementById("deleteProtocolButton")

if(createProtocol){
  createProtocol.addEventListener('change', function() {
      const container = document.getElementById('daysInputContainer');
      container.innerHTML = '';
  
      const days = parseInt(this.value);
      for (let i = 1; i <= days; i++) {
        const label = document.createElement('label');
        label.for = `stopMilkingDay${i}`;
        label.textContent = `Día ${i}:`;
  
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `stopMilkingDay${i}`;
        input.required = true;
  
        container.appendChild(label);
        container.appendChild(input);
      }
    });

} else {
  deletedProtocol.addEventListener("click", function () {
    const protocolId = this.getAttribute("data-id");
    Swal.fire({
      title: "¿Estás seguro que deseas eliminar el protocolo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector(`form[action="/stopMilking/delete/${protocolId}"]`).submit();
      }
    });
  });

}

