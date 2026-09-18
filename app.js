const propertiesData = [
    {
        id: "TP-101",
        title: "Luxury 3 Bedroom Apartment",
        location: "Uttara Sector 10, Dhaka",
        price: 12500000,
        beds: 3,
        baths: 3,
        sqft: 1650,
        purpose: "FOR SALE",
        category: "Apartment",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        isVerified: true
    },
    {
        id: "TP-102",
        title: "Modern Duplex Penthouse",
        location: "Gulshan 2, Dhaka",
        price: 38000000,
        beds: 4,
        baths: 5,
        sqft: 3200,
        purpose: "FOR SALE",
        category: "House",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        isVerified: true
    },
    {
        id: "TP-103",
        title: "Fully Furnished Office Space",
        location: "Banani, Dhaka",
        price: 180000,
        beds: 0,
        baths: 2,
        sqft: 2100,
        purpose: "FOR RENT",
        category: "Commercial",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        isVerified: true
    }
];

let savedItems = [];

// Render Listing Cards
function renderProperties(items) {
    const grid = document.getElementById('propertyGrid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
            <i class="fa-solid fa-building-circle-xmark" style="font-size: 2.5rem; margin-bottom: 10px;"></i>
            <h3>No Properties Found</h3>
            <p>Try adjusting your search or filter options.</p>
        </div>`;
        return;
    }

    items.forEach(prop => {
        const formattedPrice = prop.price.toLocaleString('en-BD');
        const isSaved = savedItems.includes(prop.id);
        const cardHtml = `
            <div class="property-card">
                <div class="card-img-container">
                    <img src="${prop.image}" alt="${prop.title}">
                    <span class="badge-featured">${prop.purpose}</span>
                    <button class="btn-fav" onclick="toggleSaveProperty('${prop.id}', this)" title="Save Property">
                        <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart" style="${isSaved ? 'color: var(--error);' : ''}"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="card-price">৳ ${formattedPrice}</div>
                    <h3 class="card-title">${prop.title}</h3>
                    <div class="card-location"><i class="fa-solid fa-location-dot"></i> ${prop.location}</div>
                    <div class="card-specs">
                        <span><i class="fa-solid fa-bed"></i> ${prop.beds} Beds</span>
                        <span><i class="fa-solid fa-bath"></i> ${prop.baths} Baths</span>
                        <span><i class="fa-solid fa-ruler-combined"></i> ${prop.sqft} sqft</span>
                    </div>
                    ${prop.isVerified ? `<div class="agent-verified-tag"><i class="fa-solid fa-circle-check"></i> Verified Agent ✓</div>` : ''}
                    <button class="btn-view-prop" onclick="alert('Viewing property details for ${prop.title} (${prop.id})')">View Details</button>
                </div>
            </div>
        `;
        grid.innerHTML += cardHtml;
    });
}

// Toggle Heart/Saved Functionality
function toggleSaveProperty(id, btn) {
    const icon = btn.querySelector('i');
    if (savedItems.includes(id)) {
        savedItems = savedItems.filter(itemId => itemId !== id);
        icon.className = 'fa-regular fa-heart';
        icon.style.color = '';
    } else {
        savedItems.push(id);
        icon.className = 'fa-solid fa-heart';
        icon.style.color = 'var(--error)';
    }
    document.getElementById('savedCount').innerText = savedItems.length;
}

// Hero Search Filter
function applySearchFilter() {
    const loc = document.getElementById('searchLocation').value.toLowerCase().trim();
    const price = parseFloat(document.getElementById('searchPrice').value);
    const type = document.getElementById('searchType').value.toLowerCase();

    const filtered = propertiesData.filter(item => {
        const matchLoc = !loc || item.location.toLowerCase().includes(loc);
        const matchPrice = isNaN(price) || item.price <= price;
        const matchType = type === 'all' || item.category.toLowerCase() === type;
        return matchLoc && matchPrice && matchType;
    });

    renderProperties(filtered);
}

// Nav Header Filter By Purpose
function filterByPurpose(purpose, element) {
    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
    if (element) element.classList.add('active');

    const filtered = propertiesData.filter(item => item.purpose === purpose);
    renderProperties(filtered);
}

// Category Card Filter
function applyCategoryFilter(catName) {
    const filtered = propertiesData.filter(item => item.category.toLowerCase() === catName.toLowerCase());
    renderProperties(filtered.length ? filtered : propertiesData);
    window.scrollTo({ top: 600, behavior: 'smooth' });
}

// Filter Drawer Toggle
function toggleFilterDrawer() {
    const drawer = document.getElementById('filterDrawer');
    drawer.style.display = (drawer.style.display === 'flex') ? 'none' : 'flex';
}

// Drawer Filter Actions
function applyDrawerFilters() {
    const minPrice = parseFloat(document.getElementById('drawerMinPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('drawerMaxPrice').value) || Infinity;

    const filtered = propertiesData.filter(item => item.price >= minPrice && item.price <= maxPrice);
    renderProperties(filtered);
    toggleFilterDrawer();
}

function resetFilters() {
    document.getElementById('drawerMinPrice').value = '';
    document.getElementById('drawerMaxPrice').value = '';
    renderProperties(propertiesData);
    toggleFilterDrawer();
}

// Search Tab Selection
function setSearchMode(mode, el) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
}

function selectPill(btn) {
    btn.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
}

// Initial Run
document.addEventListener('DOMContentLoaded', () => {
    renderProperties(propertiesData);
});