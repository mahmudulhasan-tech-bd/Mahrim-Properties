// Sample Database Array aligning with Design Tokens & Specs
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
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        isVerified: true
    }
];

// Render Listing Cards (Section 14 & 15 Specification)
function renderProperties(items) {
    const grid = document.getElementById('propertyGrid');
    grid.innerHTML = '';

    items.forEach(prop => {
        const formattedPrice = prop.price.toLocaleString('en-BD');
        const cardHtml = `
            <div class="property-card">
                <div class="card-img-container">
                    <img src="${prop.image}" alt="${prop.title}">
                    <span class="badge-featured">${prop.purpose}</span>
                    <button class="btn-fav" title="Save Property"><i class="fa-regular fa-heart"></i></button>
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
                    <button class="btn-view-prop" onclick="alert('Opening Property Details: ${prop.id}')">View Details</button>
                </div>
            </div>
        `;
        grid.innerHTML += cardHtml;
    });
}

// Search Filter Logic
function applySearchFilter() {
    const loc = document.getElementById('searchLocation').value.toLowerCase();
    const price = parseFloat(document.getElementById('searchPrice').value);

    const filtered = propertiesData.filter(item => {
        const matchLoc = item.location.toLowerCase().includes(loc);
        const matchPrice = isNaN(price) || item.price <= price;
        return matchLoc && matchPrice;
    });

    renderProperties(filtered);
}

// Drawer Toggle
function toggleFilterDrawer() {
    const drawer = document.getElementById('filterDrawer');
    drawer.style.display = (drawer.style.display === 'flex') ? 'none' : 'flex';
}

// Search Tab Switches
function setSearchMode(mode, el) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
}

// Initial Run
document.addEventListener('DOMContentLoaded', () => {
    renderProperties(propertiesData);
});
