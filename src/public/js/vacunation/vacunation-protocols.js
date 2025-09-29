const addProtocolButton = document.getElementById('addProtocolButton');
const deleteProtocolButtons = document.querySelectorAll('.delete-protocol-button');

// Agregar nuevo protocolo
addProtocolButton.addEventListener('click', async () => {
    const { value: protocolName } = await Swal.fire({
        title: 'Nuevo Protocolo',
        html: '<input id="swal-input-name" class="swal2-input" placeholder="Nombre del protocolo (ej. Etapa 1)">',
        focusConfirm: false,
        preConfirm: () => {
            const name = document.getElementById('swal-input-name').value;
            if (!name) {
                Swal.showValidationMessage('El nombre del protocolo es requerido');
            }
            return name;
        },
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar'
    });

    if (protocolName) {
        try {
            const response = await fetch('/vacunation/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: protocolName })
            });

            const result = await response.json();
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Protocolo creado correctamente'
                }).then(() => {
                    window.location.href = '/vacunacion';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message || 'Ha ocurrido un error, intenta de nuevo.'
                });
            }
        } catch (error) {
            console.error('Error al crear protocolo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error inesperado, intenta más tarde.'
            });
        }
    }
});

// Eliminar protocolo
deleteProtocolButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const protocolId = button.getAttribute('data-protocol-id');
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar Protocolo?',
            text: 'Esto no afectará a los terneros que ya tienen este protocolo asignado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (isConfirmed) {
            try {
                const response = await fetch(`/vacunation/delete/${protocolId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const result = await response.json();
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Protocolo eliminado correctamente'
                    }).then(() => {
                        window.location.href = '/vacunacion';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: result.message || 'Ha ocurrido un error, intenta de nuevo.'
                    });
                }
            } catch (error) {
                console.error('Error al eliminar protocolo:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error inesperado, intenta más tarde.'
                });
            }
        }
    });
});