// ============ Initialisation de la carte ============

let map;
let markersLayer;
let selectedFilter = 'all';
let searchTerm = '';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  renderList();
  setupEventListeners();
});

function initMap() {
  // Centrer sur Douala par défaut
  map = L.map('map').setView([4.0511, 9.7679], 13);

  // Fond de carte
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map);

  // Couche pour les marqueurs
  markersLayer = L.layerGroup().addTo(map);

  // Ajouter les marqueurs
  addMarkers();
}

function addMarkers() {
  markersLayer.clearLayers();

  const filtered = getFilteredBlanchisseries();

  filtered.forEach(blanchisserie => {
    const marker = L.marker([blanchisserie.lat, blanchisserie.lng])
      .bindPopup(createPopupContent(blanchisserie));

    marker.on('click', () => {
      highlightCard(blanchisserie.id);
    });

    markersLayer.addLayer(marker);
  });

  // Ajuster la vue si des marqueurs sont visibles
  if (filtered.length > 0) {
    const bounds = L.latLngBounds(filtered.map(b => [b.lat, b.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }
}

function createPopupContent(blanchisserie) {
  const servicesHtml = blanchisserie.services.map(service => {
    const serviceLabel = getServiceLabel(service);
    return `<span class="service-tag">${serviceLabel}</span>`;
  }).join('');

  const stars = '★'.repeat(Math.floor(blanchisserie.note)) + 
                (blanchisserie.note % 1 >= 0.5 ? '½' : '');

  return `
    <div class="map-popup">
      <h3>${blanchisserie.nom}</h3>
      <div class="address">📍 ${blanchisserie.adresse}</div>
      <div class="rating">⭐ ${blanchisserie.note} (${blanchisserie.avis} avis)</div>
      <div class="services-tags">${servicesHtml}</div>
      <div style="margin-bottom:8px; font-size:0.9rem; color:#64748B;">
        🕐 ${blanchisserie.horaires}
      </div>
      <div style="margin-bottom:12px; font-size:0.9rem; color:#64748B;">
        📞 ${blanchisserie.telephone}
      </div>
      <a href="reservation.html" class="btn btn-primary">Réserver ici</a>
    </div>
  `;
}

function getServiceLabel(service) {
  const labels = {
    'lavage': '🧺 Lavage',
    'repassage': '✨ Repassage',
    'pressing': '👔 Pressing',
    'domicile': '🏠 À domicile'
  };
  return labels[service] || service;
}

function getFilteredBlanchisseries() {
  return blanchisseries.filter(b => {
    // Filtre par service
    if (selectedFilter !== 'all' && !b.services.includes(selectedFilter)) {
      return false;
    }

    // Filtre par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return b.nom.toLowerCase().includes(search) || 
             b.quartier.toLowerCase().includes(search) ||
             b.adresse.toLowerCase().includes(search);
    }

    return true;
  });
}

function renderList() {
  const container = document.getElementById('listContainer');
  const filtered = getFilteredBlanchisseries();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding:40px; text-align:center; color:var(--text-light);">
        Aucune blanchisserie trouvée
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(blanchisserie => {
    const stars = '★'.repeat(Math.floor(blanchisserie.note));
    const servicesHtml = blanchisserie.services.map(service => {
      return `<span class="service-tag">${getServiceLabel(service)}</span>`;
    }).join('');

    return `
      <div class="blanchisserie-card" data-id="${blanchisserie.id}" onclick="focusOnBlanchisserie(${blanchisserie.id})">
        <h3>${blanchisserie.nom}</h3>
        <div class="address">📍 ${blanchisserie.adresse}</div>
        <div class="rating">
          <span class="stars">${stars}</span>
          <span>${blanchisserie.note}</span>
          <span class="reviews">(${blanchisserie.avis} avis)</span>
        </div>
        <div class="services-tags">${servicesHtml}</div>
      </div>
    `;
  }).join('');
}

function focusOnBlanchisserie(id) {
  const blanchisserie = blanchisseries.find(b => b.id === id);
  if (!blanchisserie) return;

  map.setView([blanchisserie.lat, blanchisserie.lng], 15);
  
  // Ouvrir le popup du marqueur correspondant
  markersLayer.eachLayer(marker => {
    const latLng = marker.getLatLng();
    if (latLng.lat === blanchisserie.lat && latLng.lng === blanchisserie.lng) {
      marker.openPopup();
    }
  });

  highlightCard(id);
}

function highlightCard(id) {
  document.querySelectorAll('.blanchisserie-card').forEach(card => {
    card.classList.remove('active');
  });
  const activeCard = document.querySelector(`.blanchisserie-card[data-id="${id}"]`);
  if (activeCard) {
    activeCard.classList.add('active');
    activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function setupEventListeners() {
  // Recherche
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      renderList();
      addMarkers();
    });
  }

  // Filtres
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFilter = btn.dataset.filter;
      renderList();
      addMarkers();
    });
  });

  // Sidebar mobile
  const openSidebar = document.getElementById('openSidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebar = document.getElementById('sidebar');

  if (openSidebar && closeSidebar && sidebar) {
    openSidebar.addEventListener('click', () => {
      sidebar.classList.add('open');
    });

    closeSidebar.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }
}

// Exposer la fonction globalement pour les onclick
window.focusOnBlanchisserie = focusOnBlanchisserie;
