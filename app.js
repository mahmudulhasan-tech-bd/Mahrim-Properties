// Initialize Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Firestore theke Live Data Fetch
    db.collection("properties").get().then((querySnapshot) => {
        let liveData = [];
        querySnapshot.forEach((doc) => {
            liveData.push({ id: doc.id, ...doc.data() });
        });
        if (liveData.length > 0) {
            propertiesData = liveData;
            renderProperties(propertiesData);
        }
    }).catch(err => console.log("Firebase Load Fallback: Using local array", err));
}
// Firebase Config Structure (Apnar Firebase Console theke credentials boshate hobe)
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "tasnim-properties.firebaseapp.com",
    projectId: "tasnim-properties",
    storageBucket: "tasnim-properties.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Sample Database Array (Fallback/Primary Data)
let propertiesData = [
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
let currentSearchPurpose = 'buy';

// 1. Dynamic Rendering Engine
function renderProperties(items) {
    const grid = document.getElementById('propertyGrid');
    if (!grid) return;
    
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
                <i class="fa-solid fa-building-circle-xmark" style="font-size: 2.5rem; margin-bottom: 10px;"></i>
                <h3>No Properties Found</h3>
                <p>Try resetting filters or changing location keywords.</p>
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
                    <button class="btn-view-prop" onclick="openPropertyDetails('${prop.id}')">View Details</button>
                </div>
            </div>
        `;
        grid.innerHTML += cardHtml;
    });
}

// 2. Button Action: Heart / Save System
function toggleSaveProperty(id, btnElement) {
    const icon = btnElement.querySelector('i');
    if (savedItems.includes(id)) {
        savedItems = savedItems.filter(itemId => itemId !== id);
        icon.className = 'fa-regular fa-heart';
        icon.style.color = '';
    } else {
        savedItems.push(id);
        icon.className = 'fa-solid fa-heart';
        icon.style.color = 'var(--error)';
    }
    
    const savedBadge = document.querySelector('.badge-count');
    if (savedBadge) savedBadge.innerText = savedItems.length;
}

// 3. Button Action: Hero Search Bar
function applySearchFilter() {
    const locationInput = document.getElementById('searchLocation')?.value.toLowerCase().trim() || '';
    const typeSelect = document.getElementById('searchType')?.value.toLowerCase() || 'all';
    const maxPriceInput = parseFloat(document.getElementById('searchPrice')?.value) || Infinity;

    const filtered = propertiesData.filter(item => {
        const matchLocation = !locationInput || item.location.toLowerCase().includes(locationInput);
        const matchType = typeSelect === 'all' || item.category.toLowerCase() === typeSelect;
        const matchPrice = item.price <= maxPriceInput;
        return matchLocation && matchType && matchPrice;
    });

    renderProperties(filtered);
}

// 4. Button Action: Search Tabs (Buy / Rent / Commercial / Hotels)
function setSearchMode(mode, element) {
    currentSearchPurpose = mode;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    let filtered = propertiesData;
    if (mode === 'buy') {
        filtered = propertiesData.filter(i => i.purpose === 'FOR SALE');
    } else if (mode === 'rent') {
        filtered = propertiesData.filter(i => i.purpose === 'FOR RENT');
    } else if (mode === 'commercial') {
        filtered = propertiesData.filter(i => i.category.toLowerCase() === 'commercial');
    }
    renderProperties(filtered);
}

// 5. Button Action: Categories Click Workflow
function filterByCategory(categoryName) {
    const filtered = propertiesData.filter(item => item.category.toLowerCase() === categoryName.toLowerCase());
    renderProperties(filtered.length > 0 ? filtered : propertiesData);
    
    const listSection = document.querySelector('.main-container');
    if (listSection) listSection.scrollIntoView({ behavior: 'smooth' });
}

// 6. Button Action: Filter Drawer Controls
function toggleFilterDrawer() {
    const drawer = document.getElementById('filterDrawer');
    if (!drawer) return;
    drawer.style.display = (drawer.style.display === 'flex') ? 'none' : 'flex';
}

function applyDrawerFilters() {
    const minInput = parseFloat(document.querySelectorAll('.range-inputs input')[0]?.value) || 0;
    const maxInput = parseFloat(document.querySelectorAll('.range-inputs input')[1]?.value) || Infinity;

    const filtered = propertiesData.filter(item => item.price >= minInput && item.price <= maxInput);
    renderProperties(filtered);
    toggleFilterDrawer();
}

function resetDrawerFilters() {
    document.querySelectorAll('.range-inputs input').forEach(input => input.value = '');
    renderProperties(propertiesData);
    toggleFilterDrawer();
}

// 7. Button Action: Details Trigger
function openPropertyDetails(id) {
    const property = propertiesData.find(p => p.id === id);
    if (property) {
        alert(`Property ID: ${property.id}\nTitle: ${property.title}\nPrice: ৳${property.price.toLocaleString('en-BD')}\nLocation: ${property.location}`);
    }
}

// Event Bindings on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    renderProperties(propertiesData);

    // Bind Category Cards
    const catCards = document.querySelectorAll('.cat-card');
    catCards.forEach(card => {
        card.addEventListener('click', () => {
            const catName = card.querySelector('h3')?.innerText;
            if (catName) filterByCategory(catName);
        });
    });

    // Drawer Buttons Binding
    const drawerApplyBtn = document.querySelector('.drawer-footer .btn-primary');
    if (drawerApplyBtn) drawerApplyBtn.onclick = applyDrawerFilters;

    const drawerResetBtn = document.querySelector('.drawer-footer .btn-outline');
    if (drawerResetBtn) drawerResetBtn.onclick = resetDrawerFilters;
});
