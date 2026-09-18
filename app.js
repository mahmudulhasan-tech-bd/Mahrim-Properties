// Sample Database Array aligning with Blueprint Section 9 & 60
let propertiesData = [
    {
        id: "RE-10001",
        title: "Luxury 3 Bedroom Apartment",
        location: "Uttara, Dhaka",
        price: 12000000,
        beds: 3,
        baths: 3,
        sqft: 1650,
        purpose: "FOR SALE",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        verifiedAgent: true
    },
    {
        id: "RE-10002",
        title: "Modern Duplex Flat for Rent",
        location: "Gulshan 2, Dhaka",
        price: 85000,
        beds: 4,
        baths: 4,
        sqft: 2800,
        purpose: "FOR RENT",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        verifiedAgent: true
    },
    {
        id: "RE-10003",
        title: "Commercial Office Space",
        location: "Banani, Dhaka",
        price: 45000000,
        beds: 0,
        baths: 2,
        sqft: 3200,
        purpose: "FOR SALE",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        verifiedAgent: true
    }
];

let selectedPurpose = 'all';

// Render Properties (Section 9 Card Specification)
function renderProperties(data) {
    const container = document.getElementById('propertyContainer');
    const countTag = document.getElementById('resultsCount');
    
    container.innerHTML = '';
    countTag.innerText = `Showing ${data.length} Properties`;

    if (data.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; color: #64748b;">No properties match your filter criteria.</p>`;
        return;
    }

    data.forEach(item => {
        const formattedPrice = item.price.toLocaleString('en-BD');
        const cardHtml = `
            <div class="property-card">
                <div class="property-card-img-wrapper">
                    <img src="${item.image}" alt="${item.title}">
                    <span class="tag-badge">${item.purpose}</span>
                    <button class="fav-btn" title="Save Property"><i class="fa-regular fa-heart"></i></button>
                </div>
                <div class="card-details">
                    <div class="card-price">৳ ${formattedPrice}</div>
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-location"><i class="fa-solid fa-location-dot"></i> ${item.location}</div>
                    <div class="card-features">
                        <span><i class="fa-solid fa-bed"></i> ${item.beds} Beds</span>
                        <span><i class="fa-solid fa-bath"></i> ${item.baths} Baths</span>
                        <span><i class="fa-solid fa-ruler-combined"></i> ${item.sqft} sqft</span>
                    </div>
                    ${item.verifiedAgent ? `<div class="card-agent-tag"><i class="fa-solid fa-circle-check"></i> Verified Agent ✓</div>` : ''}
                    <button class="btn-view-details" onclick="alert('Viewing Property ID: ${item.id}')">View Details</button>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

// Search & Filter (Section 8 & 50)
function filterProperties() {
    const locationInput = document.getElementById('searchLocation').value.toLowerCase();
    const typeInput = document.getElementById('searchType').value;
    const priceInput = parseFloat(document.getElementById('searchPrice').value);

    const filtered = propertiesData.filter(item => {
        const matchLocation = item.location.toLowerCase().includes(locationInput);
        const matchPrice = isNaN(priceInput) || item.price <= priceInput;
        const matchType = typeInput === 'all' || item.title.toLowerCase().includes(typeInput);

        return matchLocation && matchPrice && matchType;
    });

    renderProperties(filtered);
}

// Purpose Tabs
function setPurpose(type, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedPurpose = type;
}

// Toggle Admin Panel (Section 31 & 37)
function toggleAdminPanel() {
    const sec = document.getElementById('adminPanelSection');
    sec.style.display = sec.style.display === 'none' ? 'block' : 'none';
    if(sec.style.display === 'block') {
        sec.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add New Property dynamically (Section 33)
function handleAddNewProperty(e) {
    e.preventDefault();
    const newProperty = {
        id: `RE-${Math.floor(10000 + Math.random() * 90000)}`,
        title: document.getElementById('pTitle').value,
        location: document.getElementById('pLocation').value,
        price: parseFloat(document.getElementById('pPrice').value),
        beds: parseInt(document.getElementById('pBeds').value),
        baths: parseInt(document.getElementById('pBaths').value),
        sqft: parseInt(document.getElementById('pSqft').value),
        purpose: document.getElementById('pPurpose').value,
        image: document.getElementById('pImg').value,
        verifiedAgent: true
    };

    propertiesData.unshift(newProperty);
    renderProperties(propertiesData);
    document.getElementById('addPropertyForm').reset();
    alert('Property added successfully and submitted for Admin approval!');
}

// Auth Modal
function openAuthModal(type) {
    document.getElementById('authModal').style.display = 'flex';
    switchAuth(type);
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function switchAuth(type) {
    if(type === 'login') {
        document.getElementById('loginBox').style.display = 'block';
        document.getElementById('signupBox').style.display = 'none';
    } else {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('signupBox').style.display = 'block';
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    renderProperties(propertiesData);
});
