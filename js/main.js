// ============ Fonctions globales ============

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initReservationForm();
  initLoginTabs();
});

// ============ Navigation mobile ============

function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Fermer le menu quand on clique sur un lien
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }
}

// ============ Formulaire de réservation ============

function initReservationForm() {
  const reservationForm = document.getElementById('reservationForm');
  const reservationSuccess = document.getElementById('reservationSuccess');
  
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Récupérer les données du formulaire
      const formData = new FormData(reservationForm);
      const reservationData = {
        nom: formData.get('nom') || document.getElementById('nom')?.value,
        telephone: formData.get('telephone') || document.getElementById('telephone')?.value,
        service: formData.get('service') || document.getElementById('service')?.value,
        date: formData.get('date') || document.getElementById('date')?.value,
        heure: formData.get('heure') || document.getElementById('heure')?.value,
        adresse: formData.get('adresse') || document.getElementById('adresse')?.value,
        notes: formData.get('notes') || document.getElementById('notes')?.value
      };

      // Simuler l'enregistrement (à remplacer par un vrai backend plus tard)
      console.log('Réservation enregistrée :', reservationData);
      
      // Afficher le message de succès
      if (reservationSuccess) {
        reservationSuccess.classList.remove('hidden');
        
        // Faire défiler jusqu'au message
        reservationSuccess.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Masquer le message après 5 secondes
        setTimeout(() => {
          reservationSuccess.classList.add('hidden');
        }, 5000);
      }
      
      // Réinitialiser le formulaire
      reservationForm.reset();
    });
  }
}

// ============ Onglets connexion client/pro ============

function initLoginTabs() {
  const loginTabs = document.querySelectorAll('.login-tab');
  const loginForms = document.querySelectorAll('.login-form');
  
  if (loginTabs.length > 0) {
    loginTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Retirer la classe active de tous les onglets
        loginTabs.forEach(t => t.classList.remove('active'));
        
        // Ajouter la classe active à l'onglet cliqué
        tab.classList.add('active');
        
        // Récupérer la cible (clientForm ou proForm)
        const target = tab.dataset.target;
        
        // Afficher le bon formulaire
        loginForms.forEach(form => {
          if (form.id === target) {
            form.classList.remove('hidden');
          } else {
            form.classList.add('hidden');
          }
        });
      });
    });

    // Gestion de la soumission des formulaires de connexion
    const clientForm = document.getElementById('clientForm');
    const proForm = document.getElementById('proForm');
    
    if (clientForm) {
      clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('emailClient')?.value;
        console.log('Connexion client avec :', email);
        
        // Simuler une connexion réussie
        alert('Connexion client réussie ! (simulation)');
        
        // Rediriger vers le suivi de commande
        window.location.href = 'suivi.html';
      });
    }
    
    if (proForm) {
      proForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('emailPro')?.value;
        console.log('Connexion professionnel avec :', email);
        
        // Simuler une connexion réussie
        alert('Connexion professionnel réussie ! (simulation)');
        
        // Rediriger vers l'espace professionnel
        window.location.href = 'espace-pro.html';
      });
    }
  }
}

// ============ Utilitaires ============

// Fonction pour formater les dates en français
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Fonction pour formater les prix en euros
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

// Fonction pour générer un numéro de commande unique
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CMD-${year}-${random}`;
}

// Fonction pour valider un email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fonction pour valider un numéro de téléphone camerounais
function isValidCameroonPhone(phone) {
  const phoneRegex = /^(\+237|00237)?[6]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Exposer les fonctions utiles globalement
window.formatDate = formatDate;
window.formatPrice = formatPrice;
window.generateOrderNumber = generateOrderNumber;
window.isValidEmail = isValidEmail;
window.isValidCameroonPhone = isValidCameroonPhone;
