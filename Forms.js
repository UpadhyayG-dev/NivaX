class Forms {
    static openFormModal() {
        const service = nivaranxApp.currentServiceForForm;
        if (!service) return;
        
        // Generate form based on service.formFields
        const modalContent = document.getElementById('formModalContent');
        modalContent.innerHTML = this.generateFormHTML(service);
        
        ModalManager.openModal('formModal');
    }

    static generateFormHTML(service) {
        // Generate dynamic form based on service.formFields
        // ... (Copy your existing form generation logic)
    }

    static validateForm(form) {
        // Form validation logic
        return form.checkValidity();
    }

    static collectFormData() {
        const form = document.getElementById('nivaranx-application-form');
        const formData = new FormData(form);
        nivaranxApp.currentFormData = Object.fromEntries(formData.entries());
        
        // Handle checkbox values as arrays
        if (nivaranxApp.currentServiceForForm && nivaranxApp.currentServiceForForm.formFields) {
            for (const section of nivaranxApp.currentServiceForForm.formFields) {
                for (const field of section.fields) {
                    if (field.type === 'checkbox') {
                        const checkboxes = form.querySelectorAll(`input[name="${field.name}"]:checked`);
                        nivaranxApp.currentFormData[field.name] = Array.from(checkboxes).map(cb => cb.value);
                    }
                }
            }
        }
    }
}
