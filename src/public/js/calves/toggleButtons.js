document.addEventListener("DOMContentLoaded", function() {
    // Seleccionamos todos los botones y formularios
    const buttonsAndForms = [
        {buttonId: "newCalfButton", formId: "newCalfForm"},
        {buttonId: "newTaskButton", formId: "newTaskForm"},
        {buttonId: "newUpdateTaskButton", formId: "newUpdateTaskForm"},
        {buttonId: "newDeleteTaskButton", formId: "newDeleteTaskForm"}
    ];

    function showOrHideElement(element) {
        if (element.classList.contains("hidden")) {
            element.classList.remove("hidden");
            window.scroll({
                top: document.body.scrollHeight * (40 / 100),
                behavior: 'smooth'
            });
        } else {
            element.classList.add("hidden");
        }
    }

    function activeButton(button) {
        button.classList.toggle('active');
    }

    buttonsAndForms.forEach(item => {
        const button = document.getElementById(item.buttonId);
        const form = document.getElementById(item.formId);

        button.addEventListener("click", function() {
            showOrHideElement(form);
            activeButton(this); 
        });
    });
});