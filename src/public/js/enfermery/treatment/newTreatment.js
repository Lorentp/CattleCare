const durationSelect = document.getElementById('durationSelect');
const dayInputsContainer = document.getElementById('day-inputs-container');

durationSelect.addEventListener('change', () => {
  const days = parseInt(durationSelect.value, 10) || 0;

  
  dayInputsContainer.innerHTML = '';

  
  for (let i = 1; i <= days; i++) {
    
    const dayDiv = document.createElement('div');
    dayDiv.setAttribute('data-day', i);

    
    const dayLabel = document.createElement('label');
    dayLabel.setAttribute('for', `day-${i}`);
    dayLabel.textContent = `Día ${i}:`;

    
    const dayInput = document.createElement('input');
    dayInput.setAttribute('type', 'text');
    dayInput.setAttribute('id', `day-${i}`);
    dayInput.setAttribute('name', `day${i}`);
    dayInput.setAttribute('placeholder', `${i}° día de tratamiento`);


    dayDiv.appendChild(dayLabel);
    dayDiv.appendChild(dayInput);

    
    dayInputsContainer.appendChild(dayDiv);
  }
});