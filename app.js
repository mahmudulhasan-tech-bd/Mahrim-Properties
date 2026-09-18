import { 
  auth, db, 
  onAuthStateChanged,
  collection, query, orderBy, onSnapshot 
} from "./firebase.js";

let allProperties = [];

document.addEventListener("DOMContentLoaded", () => {
  loadPublicProperties();
  setupMobileMenu();
});

function loadPublicProperties() {
  const grid = document.getElementById('propertyGrid');
  if (!grid) return;

  const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
  onSnapshot(q, (snapshot) => {
    allProperties = [];
    snapshot.forEach(docSnap => {
      allProperties.push({ id: docSnap.id, ...docSnap.data() });
    });
    renderProperties(allProperties);
  });
}

function renderProperties(properties) {
  const grid = document.getElementById('propertyGrid');
  if (!grid) return;

  if (properties.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #707ebe; padding: 30px;">No properties available right now.</p>`;
    return;
  }

  grid.innerHTML = properties.map(prop => `
    <div class="property-card" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #fff; margin-bottom: 20px;">
      <div style="position:relative;">
        <img src="${prop.image || 'https://via.placeholder.com/300x200'}" alt="${prop.title}" style="width:100%; height:200px; object-fit:cover;">
        <span style="position:absolute; top:10px; left:10px; background: #3b82f6; color: #fff; padding: 4px 8px; font-size: 12px; border-radius: 4px;">${prop.purpose || 'For Sale'}</span>
      </div>
      <div style="padding: 15px;">
        <h3 style="margin: 0 0 5px; font-size: 18px; color:#0f172a;">${prop.title}</h3>
        <p style="color: #64748b; font-size: 14px;"><i class="fa-solid fa-location-dot"></i> ${prop.location}</p>
        <p style="font-weight: bold; color: #0284c7; font-size: 16px; margin: 10px 0;">৳ ${Number(prop.price || 0).toLocaleString()}</p>
      </div>
    </div>
  `).join('');
}

window.applySearchFilter = function() {
  const loc = document.getElementById('searchLocation')?.value.toLowerCase() || '';
  const filtered = allProperties.filter(item => item.location.toLowerCase().includes(loc));
  renderProperties(filtered);
}

function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('.nav-links');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}