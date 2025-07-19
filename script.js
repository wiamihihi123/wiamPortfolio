document.addEventListener('DOMContentLoaded', function() {
    // ===== ÉLÉMENTS DU DOM =====
    // Navigation principale
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const sections = document.querySelectorAll('section');
    const downloadCVBtn = document.querySelector('.btn-cv');
    
    // Créer l'overlay pour le menu mobile
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
    
    // Initialiser les onglets de compétences
    if (document.querySelector('.skills-tabs')) {
        initSkillsTabs();
    }
    
    // ===== FONCTIONS UTILITAIRES =====
    
    // Basculer le menu mobile
    function toggleMobileMenu() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
        navToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
        
        // Animation du bouton hamburger
        if (!isExpanded) {
            // Ajouter un délai pour l'animation d'ouverture du menu
            setTimeout(() => {
                mobileMenu.style.animation = 'slideInRight 0.4s ease-out forwards';
            }, 10);
        } else {
            mobileMenu.style.animation = 'slideOutRight 0.4s ease-in forwards';
        }
    }
    
    // Fermer le menu mobile
    function closeMobileMenu() {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenu.style.animation = 'slideOutRight 0.4s ease-in forwards';
    }
    
    // Mettre à jour le lien actif en fonction du défilement
    function updateActiveLinkOnScroll() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Mettre à jour les liens de navigation
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Gérer le style du header au défilement
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        updateActiveLinkOnScroll();
    }
    
    // ===== GESTIONNAIRES D'ÉVÉNEMENTS =====
    
    // Bouton de bascule du menu mobile
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Bouton de fermeture du menu mobile
    mobileClose.addEventListener('click', closeMobileMenu);
    
    // Fermer le menu mobile lors du clic sur l'overlay
    overlay.addEventListener('click', closeMobileMenu);
    
    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Si c'est un lien de navigation (et non un bouton de téléchargement)
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Fermer le menu mobile s'il est ouvert
                    if (mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                    
                    // Faire défiler jusqu'à la section cible
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Gérer le clic sur le bouton de téléchargement du CV
    if (downloadCVBtn) {
        downloadCVBtn.addEventListener('click', function(e) {
            // Laisser le comportement par défaut du lien
            // Le téléchargement du CV est géré directement dans le HTML
        });
    }
    
    // Gérer le défilement de la page
    window.addEventListener('scroll', handleScroll);
    
    // Initialisation
    handleScroll(); // Pour définir l'état initial du header
    updateActiveLinkOnScroll(); // Pour définir le lien actif initial

    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (!target) return;

            window.scrollTo({
                top: target.offsetTop - 80, // Ajustement pour la hauteur de la navbar
                behavior: 'smooth'
            });
            
            // Mettre à jour le lien actif
            updateActiveLink(targetId);
        });
    });

    // Mettre à jour le lien actif lors du défilement
    function updateActiveLinkOnScroll() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = '#' + section.getAttribute('id');
            }
        });

        updateActiveLink(current);
    }

    // Fonction pour mettre à jour le lien actif
    function updateActiveLink(targetId) {
        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Gestionnaire d'événement pour le défilement
    window.addEventListener('scroll', () => {
        updateActiveLinkOnScroll();
        
        // Ajouter/supprimer la classe de défilement de la navbar
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Gestionnaire d'événement pour le téléchargement du CV
    if (downloadCVBtn) {
        downloadCVBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Créer un nouvel onglet avec le CV
            const cvWindow = window.open('cv.html', '_blank');
            
            // Attendre que la fenêtre soit chargée
            cvWindow.onload = function() {
                // Utiliser html2pdf pour générer le PDF
                const element = cvWindow.document.body;
                
                // Options pour le PDF
                const opt = {
                    margin: 10,
                    filename: 'CV_WIAM_IHIHI.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                
                // Générer le PDF
                html2pdf()
                    .set(opt)
                    .from(element)
                    .save()
                    .then(() => {
                        // Fermer l'onglet après le téléchargement
                        cvWindow.close();
                        
                        // Animation de confirmation
                        downloadCVBtn.innerHTML = '<i class="fas fa-check"></i> CV Téléchargé !';
                        setTimeout(() => {
                            downloadCVBtn.innerHTML = '<i class="fas fa-download"></i> Télécharger CV';
                        }, 2000);
                    });
            };
        });
    }

    // Ajouter des animations au défilement
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };

    // Détection de la visibilité des éléments
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observer les éléments à animer
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        animationObserver.observe(element);
    });

    // Initialisation
    updateActiveLinkOnScroll();
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Form submission handling with animation
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading animation
        this.querySelector('button').disabled = true;
        this.querySelector('button').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        
        // Simulate form submission
        setTimeout(() => {
            alert('Message envoyé avec succès !');
            this.reset();
            this.querySelector('button').disabled = false;
            this.querySelector('button').innerHTML = 'Envoyer';
        }, 1500);
    });

// Gestion des onglets de compétences avec animations fluides
function initSkillsTabs() {
    const tabBtns = document.querySelectorAll('.skills-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.skills-content .tab-content');
    let isAnimating = false;
    const animationDuration = 300; // Durée de l'animation en millisecondes
    
    // Fonction pour changer d'onglet
    function switchTab(btn) {
        if (isAnimating || btn.classList.contains('active')) return;
        
        isAnimating = true;
        
        // Désactiver tous les boutons
        tabBtns.forEach(b => b.classList.remove('active'));
        
        // Activer le bouton cliqué
        btn.classList.add('active');
        
        // Récupérer l'ID de l'onglet à afficher
        const tabId = btn.getAttribute('data-tab');
        const currentTab = document.querySelector('.tab-content.active');
        const nextTab = document.getElementById(tabId);
        
        if (!nextTab) return;
        
        // Animation de transition entre les onglets
        if (currentTab) {
            currentTab.style.opacity = '0';
            currentTab.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                currentTab.classList.remove('active');
                nextTab.classList.add('active');
                
                // Réinitialiser le style pour l'animation d'entrée
                nextTab.style.opacity = '0';
                nextTab.style.transform = 'translateY(-10px)';
                
                // Forcer le recalcul des styles pour déclencher la transition
                void nextTab.offsetWidth;
                
                // Animation d'entrée
                nextTab.style.transition = `opacity ${animationDuration}ms ease, transform ${animationDuration}ms ease`;
                nextTab.style.opacity = '1';
                nextTab.style.transform = 'translateY(0)';
                
                // Réinitialiser la transition après l'animation
                setTimeout(() => {
                    nextTab.style.transition = '';
                    isAnimating = false;
                }, animationDuration);
                
            }, 150); // Délai pour l'animation de sortie
        } else {
            // Cas du premier chargement
            nextTab.classList.add('active');
            nextTab.style.opacity = '1';
            nextTab.style.transform = 'translateY(0)';
            isAnimating = false;
        }
        
        // Animer les cartes de compétences
        animateSkillCards(nextTab);
    }
    
    // Fonction pour animer les cartes de compétences
    function animateSkillCards(container) {
        const cards = container.querySelectorAll('.skill-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            
            // Forcer le recalcul des styles pour déclencher la transition
            void card.offsetWidth;
            
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            
            // Réinitialiser la transition après l'animation
            setTimeout(() => {
                card.style.transition = '';
            }, 500 + (index * 100));
        });
        
        // Animer les barres de progression
        animateProgressBars(container);
    }
    
    // Animation des barres de progression
    function animateProgressBars(container = document) {
        const progressBars = container.querySelectorAll('.progress');
        
        // Réinitialiser les largeurs
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });
        
        // Démarrer l'animation après un court délai
        setTimeout(() => {
            progressBars.forEach(bar => {
                const widthMatch = bar.getAttribute('style').match(/width:\s*(\d+)%/);
                if (widthMatch && widthMatch[1]) {
                    bar.style.width = `${widthMatch[1]}%`;
                }
            });
        }, 100);
    }
    
    // Ajouter les écouteurs d'événements
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn));
    });
    
    // Activer le premier onglet par défaut avec animation
    if (tabBtns.length > 0) {
        // Délai pour s'assurer que les styles sont chargés
        setTimeout(() => {
            const firstTab = tabBtns[0];
            firstTab.classList.add('active');
            const firstTabContent = document.getElementById(firstTab.getAttribute('data-tab'));
            if (firstTabContent) {
                firstTabContent.classList.add('active');
                firstTabContent.style.opacity = '1';
                firstTabContent.style.transform = 'translateY(0)';
                animateSkillCards(firstTabContent);
            }
        }, 100);
    }
}
    
    // Initialisation des onglets de compétences
    initSkillsTabs();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add specific animations based on element type
                if (entry.target.classList.contains('project-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                if (entry.target.classList.contains('skill-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Observe project cards and skill cards
    document.querySelectorAll('.project-card, .skill-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });



    // Add scroll to top button with animation
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        display: none;
        z-index: 100;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;

    // Add hover effect
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'scale(1.1)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'scale(1)';
    });
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: none;
        z-index: 100;
    `;
    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
