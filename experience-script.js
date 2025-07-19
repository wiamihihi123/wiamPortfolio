// Script pour la section Expériences Professionnelles
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets
    const tabButtons = document.querySelectorAll('.tab-btn');
    const experienceCards = document.querySelectorAll('.experience-card');
    
    // Fonction pour filtrer les cartes par catégorie
    function filterCards(category) {
        experienceCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                // Ajouter une animation de fondu
                card.style.animation = 'fadeInUp 0.6s ease-out forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Écouteurs d'événements pour les boutons d'onglet
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            // Filtrer les cartes
            filterCards(this.dataset.tab);
        });
    });
    
    // Animation des barres de progression au défilement
    const animateOnScroll = () => {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            const progressBar = item.querySelector('.progress');
            const skillPercent = progressBar.style.width;
            
            // Réinitialiser la largeur pour l'animation
            progressBar.style.width = '0';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animer la barre de progression
                        progressBar.style.transition = 'width 1.5s ease-in-out';
                        progressBar.style.width = skillPercent;
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(item);
        });
    };
    
    // Détecter le défilement de la page
    window.addEventListener('scroll', () => {
        const experienceSection = document.querySelector('.experience');
        const sectionPosition = experienceSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (sectionPosition < screenPosition) {
            animateOnScroll();
            // Ne pas réanimer après la première fois
            window.removeEventListener('scroll', this);
        }
    });
    
    // Initialisation
    filterCards('all');
});
