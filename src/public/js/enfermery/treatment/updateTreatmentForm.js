document.addEventListener('DOMContentLoaded', () => {
    
    const treatmentSelect = document.getElementById('nameInputUpdateTreatment');
    const durationSelect = document.getElementById('durationUpdateSelect');
    const idInput = document.getElementById('idInputUpdateTreatment');
    const dayInputsContainer = document.getElementById('day-inputs-update-container');
    const form = document.getElementById('updateTreatmentFormData');
  
    if (!treatmentSelect || !durationSelect || !idInput || !dayInputsContainer || !form) {
      console.error('Faltan elementos en el DOM');
      return;
    }
  
    function generateMedicationInputs(duration, medications = []) {
      dayInputsContainer.innerHTML = ''; 
      for (let i = 0; i < duration; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-input';
  
        const dayLabel = document.createElement('label');
        dayLabel.textContent = `Día ${i + 1}:`;
        dayLabel.setAttribute('for', `medication-day-${i}`);
  
        const dayInput = document.createElement('input');
        dayInput.type = 'text';
        dayInput.id = `medication-day-${i}`;
        dayInput.name = `medication[${i}]`; 
        dayInput.value = medications[i] || ''; 
        dayInput.placeholder = `Medicamento para el día ${i + 1}`;
  
        dayDiv.appendChild(dayLabel);
        dayDiv.appendChild(dayInput);
        dayInputsContainer.appendChild(dayDiv);
      }
    }
  
    // Evento al seleccionar un tratamiento
    treatmentSelect.addEventListener('change', () => {
      const selectedOption = treatmentSelect.options[treatmentSelect.selectedIndex];
      if (!selectedOption.value) {
        
        idInput.value = '';
        durationSelect.value = '';
        dayInputsContainer.innerHTML = '';
        return;
      }      
      const treatmentId = selectedOption.value;
      const title = selectedOption.getAttribute('data-title');
      const duration = parseInt(selectedOption.getAttribute('data-duration'), 10);
      const medications = JSON.parse(selectedOption.getAttribute('data-medication') || '[]');
  
      // Actualizar formulario
      idInput.value = treatmentId;
      durationSelect.value = duration;
      generateMedicationInputs(duration, medications);
    });
  
    durationSelect.addEventListener('change', () => {
      const newDuration = parseInt(durationSelect.value, 10);
      if (!isNaN(newDuration)) {
        const currentMedications = Array.from(
          dayInputsContainer.querySelectorAll('input')
        ).map(input => input.value);
        generateMedicationInputs(newDuration, currentMedications.slice(0, newDuration));
      }
    });
  
    // Evento al enviar el formulario
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      // Recolectar datos del formulario
      const treatmentId = idInput.value;
      const duration = parseInt(durationSelect.value, 10);
      const medications = Array.from(
        dayInputsContainer.querySelectorAll('input')
      ).map(input => input.value.trim());
  
      if (!treatmentId || isNaN(duration) || medications.length !== duration) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
      }
  
      // Datos para enviar al backend
      const updatedTreatment = {
        _id: treatmentId,
        title: treatmentSelect.options[treatmentSelect.selectedIndex].getAttribute('data-title'),
        duration: duration,
        medication: medications
      };
  
      // Enviar datos al backend con fetch
      fetch(`/treatment/update/${treatmentId}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTreatment)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al actualizar el tratamiento');
          }
          window.location.href = '/home';
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Hubo un error al actualizar el tratamiento. Contacta a soporte para más detalles.');
        });
    });
  });