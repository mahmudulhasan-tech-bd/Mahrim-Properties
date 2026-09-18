// Firebase Configuration (Replace with your actual Firebase Credentials)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const auth = firebase.auth();

// Fetch and Render Live Properties
function loadProperties() {
    const propertyGrid = document.getElementById('propertyList') || document.getElementById('adminPropertyList');
    if (!propertyGrid) return;

    db.ref('properties').on('value', (snapshot) => {
        propertyGrid.innerHTML = '';
        const data = snapshot.val();
        
        if (!data) {
            propertyGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; font-size: 1.1rem; padding: 40px;">No properties available right now.</p>`;
            return;
        }

        Object.keys(data).forEach((key) => {
            const item = data[key];
            const isAdminPage = window.location.pathname.includes('admin.html');
            
            const cardHtml = `
                <div class="property-card">
                    <span class="tag">${item.category}</span>
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'">
                    <div class="card-details">
                        <h3>${item.title}</h3>
                        <p><i class="fa-solid fa-location-dot"></i> ${item.location}</p>
                        <div class="price">BDT ${Number(item.price).toLocaleString()}</div>
                        ${isAdminPage ? 
                            `<button onclick="deleteProperty('${key}')" class="btn-delete"><i class="fa-solid fa-trash"></i> Delete Listing</button>` : 
                            `<a href="https://wa.me/${item.whatsapp}?text=Hi,\%20I\%20am\%20interested\%20in\%20${encodeURIComponent(item.title)}" target="_blank" class="book-btn"><i class="fa-brands fa-whatsapp"></i> Contact via WhatsApp</a>`
                        }
                    </div>
                </div>
            `;
            propertyGrid.innerHTML += cardHtml;
        });
    });
}

// Admin Function: Add Property
function handlePropertySubmit(e) {
    e.preventDefault();
    const title = document.getElementById('propTitle').value;
    const category = document.getElementById('propCategory').value;
    const location = document.getElementById('propLocation').value;
    const price = document.getElementById('propPrice').value;
    const image = document.getElementById('propImage').value;
    const whatsapp = document.getElementById('propWhatsapp').value;

    const newPropRef = db.ref('properties').push();
    newPropRef.set({
        title, category, location, price, image, whatsapp,
        createdAt: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert("Property published successfully!");
        document.getElementById('addPropertyForm').reset();
    }).catch((err) => {
        alert("Error adding property: " + err.message);
    });
}

// Admin Function: Delete Property
function deleteProperty(key) {
    if (confirm("Are you sure you want to delete this listing?")) {
        db.ref(`properties/${key}`).remove()
            .then(() => alert("Property deleted successfully!"))
            .catch((err) => alert("Error deleting: " + err.message));
    }
}

// Global Filter System
function filterProperties() {
    const category = document.getElementById('filterCategory')?.value.toLowerCase();
    const location = document.getElementById('filterLocation')?.value.toLowerCase();
    const maxPrice = Number(document.getElementById('filterPrice')?.value);

    const cards = document.querySelectorAll('.property-card');
    cards.forEach(card => {
        const cardCategory = card.querySelector('.tag')?.innerText.toLowerCase();
        const cardLocation = card.querySelector('p')?.innerText.toLowerCase();
        const cardPriceText = card.querySelector('.price')?.innerText.replace(/[^0-9]/g, '');
        const cardPrice = Number(cardPriceText);

        const matchCat = (category === 'all' || !category) || cardCategory.includes(category);
        const matchLoc = !location || cardLocation.includes(location);
        const matchPrice = !maxPrice || (cardPrice <= maxPrice);

        if (matchCat && matchLoc && matchPrice) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Auth Modal Controls
function openUserModal(type) {
    document.getElementById('userAuthModal').style.display = 'flex';
    if (type === 'login') {
        document.getElementById('userLoginBox').style.display = 'block';
        document.getElementById('userSignupBox').style.display = 'none';
    } else {
        document.getElementById('userLoginBox').style.display = 'none';
        document.getElementById('userSignupBox').style.display = 'block';
    }
}

function closeUserModal() {
    document.getElementById('userAuthModal').style.display = 'none';
}

function switchModal(type) {
    openUserModal(type);
}

// Auto Load Init
document.addEventListener('DOMContentLoaded', () => {
    loadProperties();
});
