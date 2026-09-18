const featuredProperties = [
    { id: 1, title: "Luxury 3 Bedroom Apartment", location: "Uttara Sector 10, Dhaka", price: "1,25,00,000", beds: 3, baths: 3, size: "1850 sqft", type: "apartment", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Modern Duplex Penthouse", location: "Gulshan 2, Dhaka", price: "3,80,00,000", beds: 4, baths: 5, size: "3200 sqft", type: "duplex", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Commercial Office Space", location: "Banani C/A, Dhaka", price: "2,50,00,000", beds: 0, baths: 2, size: "2100 sqft", type: "commercial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" }
];

function renderUserListings(items) {
    const grid = document.getElementById('publicPropGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if(items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No properties found matching your criteria.</p>`;
        return;
    }

    items.forEach(p => {
        grid.innerHTML += `
            <div class="prop-card">
                <img src="${p.image}" class="prop-img" alt="${p.title}">
                <div class="prop-info">
                    <div class="prop-price">৳ ${p.price}</div>
                    <h3 class="prop-title">${p.title}</h3>
                    <div class="prop-loc"><i class="fa-solid fa-location-dot"></i> ${p.location}</div>
                    <div class="prop-footer">
                        <span><i class="fa-solid fa-bed"></i> ${p.beds} Beds</span>
                        <span><i class="fa-solid fa-bath"></i> ${p.baths} Baths</span>
                        <span><i class="fa-solid fa-ruler-combined"></i> ${p.size}</span>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterUserListings() {
    const searchInput = document.getElementById('userSearch');
    const typeSelect = document.getElementById('typeFilter');
    if (!searchInput || !typeSelect) return;

    const searchVal = searchInput.value.toLowerCase();
    const typeVal = typeSelect.value;

    const filtered = featuredProperties.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchVal) || p.location.toLowerCase().includes(searchVal);
        const matchesType = (typeVal === 'all') || (p.type === typeVal);
        return matchesSearch && matchesType;
    });

    renderUserListings(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    renderUserListings(featuredProperties);
});
