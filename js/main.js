document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Formulaire de réservation (simulation)
  const reservationForm = document.getElementById('reservationForm');
  const reservationSuccess = document.getElementById('reservationSuccess');
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      reservationSuccess.classList.remove('hidden');
      reservationForm.reset();
    });
  }

  // Onglets connexion client/pro
  const loginTabs = document.querySelectorAll('.login-tab');
  const loginForms = document.querySelectorAll('.login-form');
  if (loginTabs.length) {
    loginTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        loginTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.target;
        loginForms.forEach(form => {
          form.classList.toggle('hidden', form.id !== target);
        });
      });
    });
  }
});
