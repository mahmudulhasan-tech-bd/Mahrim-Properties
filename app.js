const firebaseConfig = {
    apiKey: "AIzaSyC9-OCF3L9yTL-yN9m9IpRBtkRK_T4u-Y8",
    authDomain: "mahrim-properties.firebaseapp.com",
    databaseURL: "https://mahrim-properties-default-rtdb.firebaseio.com",
    projectId: "mahrim-properties",
    storageBucket: "mahrim-properties.firebasestorage.app",
    messagingSenderId: "1091253349290",
    appId: "1:1091253349290:web:b4465b36a691c702f559d3",
    measurementId: "G-E4RMTTT2XY"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
let allProperties = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchProperties();
});

// Admin Passkey Protection
function checkAdminAuth() {
    const pass = document.getElementById('adminPassKey').value;
    if (pass === "admin123") {
        document.getElementById('adminLoginModal').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
    } else {
        alert("Incorrect Access Code!");
    }
}

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

function renderListings(properties) {
    const listContainer = document.getElementById('propertyList');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    if (properties.length === 0) {
        listContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #707ebe;">No Properties Available At The Moment.</p>';
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
                    ${item.category === 'hotel' ? 'Book Room' : 'Inquire Now'}
                </button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

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

function addProperty(e) {
    e.preventDefault();
    const newProp = {
        title: document.getElementById('pTitle').value,
        category: document.getElementById('pCategory').value,
        price: document.getElementById('pPrice').value,
        location: document.getElementById('pLocation').value,
        bed: document.getElementById('pBed').value || 'N/A',
        img: document.getElementById('pImg').value
    };

    db.ref('properties').push(newProp).then(() => {
        alert('Property Listed Successfully!');
        document.getElementById('addPropertyForm').reset();
    });
}

function renderAdminListings(properties) {
    const container = document.getElementById('adminPropertyList');
    container.innerHTML = '';

    properties.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid #e0e5f2;';
        itemDiv.innerHTML = `
            <div>
                <strong style="color:#1b2559;">${item.title}</strong>
                <div style="font-size:0.8rem; color:#707ebe;">${item.category.toUpperCase()} - BDT ${item.price}</div>
            </div>
            <button onclick="deleteProperty('${item.id}')" style="background:#ff5b5b; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">Delete</button>
        `;
        container.appendChild(itemDiv);
    });
}

function deleteProperty(id) {
    if (confirm('Are you sure to delete this item?')) {
        db.ref('properties/' + id).remove();
    }
}

function openBookingModal(title) {
    document.getElementById('modalTitle').innerText = "Inquire for: " + title;
    document.getElementById('bookingModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function handleBooking(e) {
    e.preventDefault();
    alert('Thank you! Your inquiry has been sent to Mahrim Properties.');
    closeModal();
}
