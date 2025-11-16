class Services {
    static serviceData = {
        national: { 
            name: 'National', 
            icon: 'fa-flag', 
            services: [ 
                { 
                    name: 'Passport', 
                    icon: 'fa-passport', 
                    fees: { official: 1500, platform: 99, total: 1599}, 
                    docs: ["Aadhaar Card", "PAN Card", "Address Proof", "Photo"],
                    formFields: [
                        // ... form fields data
                    ]
                },
                // ... other services
            ]
        },
        // ... other categories
    };

    static populateServiceCards(filterText = '') {
        // Implementation for populating service cards
    }

    static populateExploreServices(filterText = '') {
        const grid = document.getElementById('exploreServicesGrid');
        const noServicesFound = document.getElementById('exploreNoServicesFound');
        grid.innerHTML = '';
        let foundServices = false;

        if (filterText === '') {
            for (const [key, data] of Object.entries(this.serviceData)) {
                const card = this.createServiceCard(key, data);
                grid.appendChild(card);
                foundServices = true;
            }
        } else {
            let allMatchingServices = [];
            for (const [key, data] of Object.entries(this.serviceData)) {
                const matching = data.services.filter(service => 
                    service.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    data.name.toLowerCase().includes(filterText.toLowerCase())
                );
                matching.forEach(service => {
                    allMatchingServices.push({ ...service, categoryKey: key, categoryName: data.name });
                });
            }

            if (allMatchingServices.length > 0) {
                allMatchingServices.forEach(service => {
                    const card = this.createServiceCard(service.categoryKey, service, true);
                    grid.appendChild(card);
                    foundServices = true;
                });
            }
        }

        noServicesFound.style.display = foundServices ? 'none' : 'block';
    }

    static createServiceCard(categoryKey, data, isIndividualService = false) {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.dataset.category = categoryKey;
        
        if (isIndividualService) {
            card.innerHTML = `
                <div class="service-icon"><i class="fas ${data.icon}"></i></div>
                <div class="service-name">${data.name}</div>`;
            card.onclick = () => this.openProcessModal(categoryKey, data.name);
        } else {
            card.innerHTML = `
                <div class="service-icon"><i class="fas ${data.icon}"></i></div>
                <div class="service-name">${data.name}</div>`;
            card.onclick = () => this.openServiceModal(categoryKey);
        }
        
        return card;
    }

    static openServiceModal(categoryKey) {
        const category = this.serviceData[categoryKey];
        const modalContent = document.getElementById('serviceModalContent');
        
        let servicesHtml = category.services.map(service => `
            <div class="service-item" onclick="Services.openProcessModal('${categoryKey}', '${service.name}')">
                <i class="fas ${service.icon}"></i>
                <span>${service.name}</span>
            </div>
        `).join('');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title"><i class="fas ${category.icon}"></i> ${category.name} सेवाएँ</h2>
                <button class="close-modal" onclick="ModalManager.closeAllModals()">&times;</button>
            </div>
            <div class="service-list">${servicesHtml}</div>`;
        
        ModalManager.openModal('serviceModal');
    }

    static openProcessModal(categoryKey, serviceName) {
        const service = this.serviceData[categoryKey].services.find(s => s.name === serviceName);
        service.categoryKey = categoryKey;
        nivaranxApp.currentServiceForForm = service;
        
        // Add to user activity
        nivaranxApp.userActivity.unshift({
            description: `सेवा विवरण देखे: ${serviceName}`,
            timestamp: new Date().toISOString(),
            icon: service.icon
        });
        localStorage.setItem('userActivity', JSON.stringify(nivaranxApp.userActivity));
        
        const modalContent = document.getElementById('processModalContent');
        // ... rest of process modal rendering
        ModalManager.openModal('processModal');
    }

    static filterServices() {
        // Implementation for filtering services
    }
}
