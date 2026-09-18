// 1. Firebase Configuration (Apnar Firebase Console theke credentials bosaai deben)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    databaseURL: "https://your-app-default-rtdb.firebaseio.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "YOUR_APP_ID"
};

// Firebase Init
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Global properties array
let allProperties = [];

// Load data automatically when page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchProperties();
});

// Fetch Properties from Firebase
function fetchProperties() {
    db.ref('properties').on('value', (snapshot) => {
        allProperties = [];
        const data = snapshot.val();
        for (let id in data) {
            allProperties.push({ id, ...data[id] });
        }
        renderListings(allProperties);
        if (document.getElementById('adminPropertyList')) {
            renderAdminListings(allProperties);
        }
    });
}

// Display listings on Customer View
function renderListings(properties) {
    const listContainer = document.getElementById('propertyList');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    if (properties.length === 0) {
        listContainer.innerHTML = '<p>Kono Property Paowa Jayni.</p>';
        return;
    }

    properties.forEach(item => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}">
            <div class="card-details">
                <span class="tag">${item.category}</span>
                <h3>${item.title}</h3>
                <p><i class="fa-solid fa-location-dot"></i> ${item.location}</p>
                <p><i class="fa-solid fa-bed"></i> ${item.bed || 'N/A'}</p>
                <div class="price">BDT ${Number(item.price).toLocaleString()}</div>
                <button class="book-btn" onclick="openBookingModal('${item.title}')">
                    ${item.category === 'hotel' ? 'Book Room' : 'Contact Owner'}
                </button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// Filter Function
function filterProperties() {
    const category = document.getElementById('filterCategory').value;
    const location = document.getElementById('filterLocation').value.toLowerCase();
    const maxPrice = document.getElementById('filterPrice').value;

    const filtered = allProperties.filter(item => {
        const matchesCategory = (category === 'all' || item.category === category);
        const matchesLocation = item.location.toLowerCase().includes(location);
        const matchesPrice = (!maxPrice || Number(item.price) <= Number(maxPrice));
        
        return matchesCategory && matchesLocation && matchesPrice;
    });

    renderListings(filtered);
}

// Add New Property (Admin Panel)
function addProperty(e) {
    e.preventDefault();
    const newProp = {
        title: document.getElementById('pTitle').value,
        category: document.getElementById('pCategory').value,
        price: document.getElementById('pPrice').value,
        location: document.getElementById('pLocation').value,
        bed: document.getElementById('pBed').value,
        img: document.getElementById('pImg').value,
        desc: document.getElementById('pDesc').value
    };

    db.ref('properties').push(newProp).then(() => {
        alert('Property Successfull vabe Add Hoyeche!');
        document.getElementById('addPropertyForm').reset();
    });
}

// Render Listings in Admin View
function renderAdminListings(properties) {
    const container = document.getElementById('adminPropertyList');
    container.innerHTML = '';

    properties.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #ccc;';
        itemDiv.innerHTML = `
            <div>
                <strong>${item.title}</strong> (${item.category}) - BDT ${item.price}
            </div>
            <button onclick="deleteProperty('${item.id}')" style="background:#ef4444; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>
        `;
        container.appendChild(itemDiv);
    });
}

// Delete Property
function deleteProperty(id) {
    if (confirm('Aponi ki shottii ei property-ti delete korte chan?')) {
        db.ref('properties/' + id).remove();
    }
}

// Booking Modal Handlers
function openBookingModal(title) {
    document.getElementById('modalTitle').innerText = "Inquire for: " + title;
    document.getElementById('bookingModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function handleBooking(e) {
    e.preventDefault();
    alert('Dhonyobad! Apnar request-ti amader kache poucheche. Khub shiggori jogajog kora hobe.');
    closeModal();
}