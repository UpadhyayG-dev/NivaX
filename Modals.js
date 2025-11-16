class ModalManager {
    static openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    static closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    static closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
        
        // Stop camera if scanner is open
        if (nivaranxApp.stream) {
            nivaranxApp.stream.getTracks().forEach(track => track.stop());
            nivaranxApp.stream = null;
        }
    }

    static closeDocumentPreview() {
        document.getElementById('documentPreviewModal').classList.remove('active');
    }

    static setupModalContent() {
        // Setup discover, updates, and other modal content
        document.getElementById('discoverModalContent').innerHTML = this.getDiscoverContent();
        document.getElementById('updatesModalContent').innerHTML = this.getUpdatesContent();
        document.getElementById('loginModalContent').innerHTML = this.getLoginContent();
    }

    static getDiscoverContent() {
        return `
            <div class="modal-header">
                <h2 class="modal-title"><i class="fas fa-info-circle"></i> NIVARANX के बारे में</h2>
                <button class="close-modal" onclick="ModalManager.closeAllModals()">&times;</button>
            </div>
            <!-- Discover content -->`;
    }

    static getUpdatesContent() {
        return `
            <div class="modal-header">
                <h2 class="modal-title"><i class="fas fa-newspaper"></i> नवीनतम अपडेट</h2>
                <button class="close-modal" onclick="ModalManager.closeAllModals()">&times;</button>
            </div>
            <!-- Updates content -->`;
    }

    static getLoginContent() {
        return `
            <div class="login-header">
                <img src="https://img1.wsimg.com/isteam/ip/e8186a9b-5cfd-4d09-9ac8-87df4de0cc9e/NivaranX%E2%84%A2.png" alt="NIVARANX Logo" class="login-logo-image">
                <h1 class="login-title">NIVARANX</h1>
                <div class="login-subtitle">Bharosa. Seva. Safalta.</div>
            </div>
            <div id="auth-container"></div>`;
    }
}
