// --- App Initialization ---
class App {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.currentServiceForForm = null;
        this.currentFormData = null;
        this.userDocuments = JSON.parse(localStorage.getItem('userDocuments') || '[]');
        this.userActivity = JSON.parse(localStorage.getItem('userActivity') || '[]');
        this.stream = null;
        this.currentDocumentType = null;
        this.currentDocumentImage = null;
        this.paymentScreenshot = null;
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.startIntroSequence();
            Auth.checkLoginState();
            this.setupThemeToggle();
        });
    }

    setupEventListeners() {
        // Search input
        document.getElementById('serviceSearchInput').addEventListener('input', Services.filterServices);
        
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e, item));
        });

        // Explore search
        const exploreSearch = document.getElementById('exploreServiceSearch');
        if (exploreSearch) {
            exploreSearch.addEventListener('input', (e) => Services.populateExploreServices(e.target.value));
        }
    }

    handleNavigation(e, item) {
        e.preventDefault();
        
        if (!this.isLoggedIn) { 
            Utils.showToast('कृपया पहले लॉगिन करें।', 'error'); 
            ModalManager.openModal('loginModal');
            return; 
        }
        
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        ModalManager.closeAllModals();
        const target = item.dataset.target;
        
        switch(target) {
            case 'home':
                Services.populateServiceCards('');
                break;
            case 'profile':
                Auth.renderProfileModal();
                ModalManager.openModal('profileModal');
                break;
            case 'discover':
                ModalManager.openModal('discoverModal');
                break;
            case 'explore':
                Services.populateExploreServices();
                ModalManager.openModal('exploreModal');
                break;
            case 'updates':
                ModalManager.openModal('updatesModal');
                break;
        }
    }

    startIntroSequence() {
        const splashScreen = document.getElementById('splash-screen');
        const logoIntro = document.getElementById('logo-intro');
        const introSlides = document.getElementById('intro-slides');
        const fingerprintScannerEl = document.getElementById('fingerprint-scanner');
        
        setTimeout(() => {
            logoIntro.classList.remove('visible');
            introSlides.classList.add('visible');
            this.startSlideshow();
        }, 2500);

        fingerprintScannerEl.addEventListener('click', () => {
            fingerprintScannerEl.classList.add('scanning');
            setTimeout(() => {
                fingerprintScannerEl.classList.add('success');
            }, 1500);
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                splashScreen.addEventListener('transitionend', () => splashScreen.style.display = 'none');
                if(this.isLoggedIn) {
                    this.showMainApp();
                } else {
                    ModalManager.openModal('loginModal');
                }
            }, 2000);
        }, { once: true });
    }

    startSlideshow() {
        const slides = document.querySelectorAll('#intro-slides .slide');
        let currentSlide = 0;
        
        const slideInterval = setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 2000);
        
        setTimeout(() => {
            clearInterval(slideInterval);
            document.getElementById('intro-slides').classList.remove('visible');
            document.getElementById('fingerprint-scanner').classList.add('visible');
        }, 6000);
    }

    showMainApp() {
        document.querySelector('.app-header').classList.add('visible');
        document.querySelector('.app-container').classList.add('visible');
        document.querySelector('.bottom-nav').classList.add('visible');
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
            
            Utils.showToast(newTheme === 'dark' ? 'डार्क मोड सक्रिय' : 'लाइट मोड सक्रिय', 'info');
        });
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-moon';
        } else {
            themeIcon.className = 'fas fa-sun';
        }
    }
}

// Initialize the app
const nivaranxApp = new App();
