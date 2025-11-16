class Auth {
    static renderAuthForm(isLogin = true) {
        const container = document.getElementById('auth-container');
        if (isLogin) {
            container.innerHTML = this.getLoginForm();
        } else {
            container.innerHTML = this.getRegisterForm();
        }
    }

    static getLoginForm() {
        return `
            <div class="login-form">
                <div class="form-group">
                    <label class="form-label">मोबाइल नंबर</label>
                    <input type="tel" class="form-control" id="loginMobile" placeholder="10-अंकीय मोबाइल नंबर">
                </div>
                <div class="form-group">
                    <label class="form-label">पासवर्ड</label>
                    <input type="password" class="form-control" id="loginPassword" placeholder="आपका पासवर्ड">
                </div>
                <button class="btn btn-primary" onclick="Auth.handleLogin()">
                    <i class="fas fa-sign-in-alt"></i> लॉगिन करें
                </button>
                <div class="form-footer">
                    खाता नहीं है? <a href="#" onclick="Auth.renderAuthForm(false)">रजिस्टर करें</a>
                </div>
            </div>`;
    }

    static getRegisterForm() {
        return `
            <div class="login-form">
                <div class="form-group">
                    <label class="form-label">पूरा नाम</label>
                    <input type="text" class="form-control" id="regName" placeholder="आपका पूरा नाम">
                </div>
                <div class="form-group">
                    <label class="form-label">ईमेल</label>
                    <input type="email" class="form-control" id="regEmail" placeholder="आपका ईमेल पता">
                </div>
                <div class="form-group">
                    <label class="form-label">मोबाइल नंबर</label>
                    <input type="tel" class="form-control" id="regMobile" placeholder="10-अंकीय मोबाइल नंबर">
                </div>
                <div class="form-group">
                    <label class="form-label">पासवर्ड बनाएं</label>
                    <input type="password" class="form-control" id="regPassword" placeholder="एक मजबूत पासवर्ड">
                </div>
                <button class="btn btn-primary" onclick="Auth.handleRegister()">
                    <i class="fas fa-user-plus"></i> रजिस्टर करें
                </button>
                <div class="form-footer">
                    पहले से खाता है? <a href="#" onclick="Auth.renderAuthForm(true)">लॉगिन करें</a>
                </div>
            </div>`;
    }

    static handleRegister() {
        const users = JSON.parse(localStorage.getItem('nivaranx_users') || '{}');
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const mobile = document.getElementById('regMobile').value;
        const password = document.getElementById('regPassword').value;

        if (!name || !Utils.validateEmail(email) || !Utils.validateMobile(mobile) || password.length < 6) { 
            Utils.showToast('कृपया सभी जानकारी सही से भरें।', 'error'); 
            return; 
        }
        
        if (users[mobile]) { 
            Utils.showToast('यह मोबाइल नंबर पहले से पंजीकृत है।', 'error'); 
            return; 
        }

        users[mobile] = { 
            name, 
            email, 
            password, 
            mobile, 
            joined: new Date().toISOString() 
        };
        
        localStorage.setItem('nivaranx_users', JSON.stringify(users));
        Utils.showToast('पंजीकरण सफल! अब लॉगिन करें।', 'success');
        this.renderAuthForm(true);
    }

    static handleLogin() {
        const users = JSON.parse(localStorage.getItem('nivaranx_users') || '{}');
        const mobile = document.getElementById('loginMobile').value;
        const password = document.getElementById('loginPassword').value;

        const user = users[mobile];
        if (user && user.password === password) {
            nivaranxApp.isLoggedIn = true;
            nivaranxApp.currentUser = user;
            sessionStorage.setItem('nivaranx_currentUser', JSON.stringify(user));
            ModalManager.closeAllModals();
            nivaranxApp.showMainApp();
            Utils.showToast(`स्वागत है, ${user.name}!`, 'success');
        } else {
            Utils.showToast('गलत मोबाइल नंबर या पासवर्ड।', 'error');
        }
    }

    static logout() {
        nivaranxApp.isLoggedIn = false;
        nivaranxApp.currentUser = null;
        sessionStorage.removeItem('nivaranx_currentUser');
        ModalManager.closeAllModals();
        document.querySelector('.app-header').classList.remove('visible');
        document.querySelector('.app-container').classList.remove('visible');
        document.querySelector('.bottom-nav').classList.remove('visible');
        ModalManager.openModal('loginModal');
        this.renderAuthForm(true);
        Utils.showToast("आप सफलतापूर्वक लॉगआउट हो गए हैं।", "info");
    }

    static checkLoginState() {
        const userJson = sessionStorage.getItem('nivaranx_currentUser');
        if (userJson) {
            nivaranxApp.isLoggedIn = true;
            nivaranxApp.currentUser = JSON.parse(userJson);
        } else {
            this.renderAuthForm(true);
        }
    }

    static renderProfileModal() {
        // Profile modal rendering logic
        // ... (Copy your existing profile modal code)
    }
}
