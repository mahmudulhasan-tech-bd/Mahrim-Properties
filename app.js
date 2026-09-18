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
const auth = firebase.auth();
let allProperties = [];
let currentCategoryFilter = 'all';

document.addEventListener("DOMContentLoaded", () => {
    fetchProperties();
    loadSiteSettings();

    if (document.getElementById('adminAuthModal')) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                document.getElementById('adminAuthModal').style.display = 'none';
                document.getElementById('adminDashboard').style.display = 'block';
                if(document.getElementById('loggedInUserText')){
                    document.getElementById('loggedInUserText').innerText = "Logged in: " + user.email;
                }
            } else {
                document.getElementById('adminDashboard').style.display = 'none';
                document.getElementById('adminAuthModal').style.display = 'flex';
            }
        });
    }
});

function handleEmailLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPassword').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => alert("Login Successful!"))
        .catch((error) => alert("Login Failed: " + error.message));
}

function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert("Password Reset Link sent to your Email!");
            showLoginBox();
        })
        .catch((error) => alert("Error: " + error.message));
}

function handleLogout() {
    auth.signOut().then(() => alert("Logged Out Successfully."));
}

function showForgotBox() {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('forgotBox').style.display = 'block';
}

function showLoginBox() {
    document.getElementById('forgotBox').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
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
            renderAdminListings(getFilteredProperties());
            updateDashboardStats(allProperties);
        }
    });
}

function updateDashboardStats(props) {
    document.getElementById('statTotal').innerText = props.length;
    document.getElementById('statRent').innerText = props.filter(p => p.category === 'rent').length;
    document.getElementById('statSell').innerText = props.filter(p => p.category === 'sell').length;
    document.getElementById('statHotel').innerText = props.filter(p => p.category === 'hotel').length;
}

function filterAdminTable(cat) {
    currentCategoryFilter = cat;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeTab = document.getElementById(`tab-${cat}`);
    if (activeTab) activeTab.classList.add('active');
    renderAdminListings(getFilteredProperties());
}

function getFilteredProperties() {
    if (currentCategoryFilter === 'all') return allProperties;
    return allProperties.filter(p => p.category === currentCategoryFilter);
}

function renderAdminListings(properties) {
    const container = document.getElementById('adminPropertyList');
    if (!container) return;
    if (properties.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align:center;">No listings found in this category.</p>';
        return;
    }

    let html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    properties.forEach(item => {
        html += `
            <tr>
                <td><img src="${item.img}" alt="thumb" style="width:50px; height:50px; object-fit:cover; border-radius:6px;"></td>
                <td><strong>${item.title}</strong></td>
                <td><span style="text-transform:uppercase; font-size:0.75rem; font-weight:bold; color:#4318ff;">${item.category}</span></td>
                <td>BDT ${Number(item.price).toLocaleString()}</td>
                <td>${item.location}</td>
                <td>
                    <button onclick="editProperty('${item.id}')" style="background:#4318ff; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; margin-right:5px;">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button onclick="deleteProperty('${item.id}')" style="background:#ff5b5b; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function handlePropertySubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('editPropertyId').value;
    const propData = {
        title: document.getElementById('pTitle').value,
        category: document.getElementById('pCategory').value,
        price: document.getElementById('pPrice').value,
        location: document.getElementById('pLocation').value,
        bed: document.getElementById('pBed').value || 'N/A',
        img: document.getElementById('pImg').value
    };

    if (editId) {
        db.ref('properties/' + editId).update(propData).then(() => {
            alert('Property Updated Successfully!');
            resetForm();
        });
    } else {
        db.ref('properties').push(propData).then(() => {
            alert('Property Published Successfully!');
            resetForm();
        });
    }
}

function editProperty(id) {
    const item = allProperties.find(p => p.id === id);
    if (!item) return;

    document.getElementById('editPropertyId').value = item.id;
    document.getElementById('pTitle').value = item.title;
    document.getElementById('pCategory').value = item.category;
    document.getElementById('pPrice').value = item.price;
    document.getElementById('pLocation').value = item.location;
    document.getElementById('pBed').value = item.bed || '';
    document.getElementById('pImg').value = item.img;

    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Property';
    document.getElementById('submitBtn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Update Property';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
}

function resetForm() {
    document.getElementById('editPropertyId').value = '';
    document.getElementById('addPropertyForm').reset();
    document.getElementById('formTitle').innerHTML = '<i class="fa-solid fa-circle-plus"></i> Add New Property';
    document.getElementById('submitBtn').innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Publish Listing';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function deleteProperty(id) {
    if (confirm('Are you sure to delete this listing permanently?')) {
        db.ref('properties/' + id).remove();
    }
}

function saveSiteSettings(e) {
    e.preventDefault();
    const settings = {
        phone: document.getElementById('settingPhone').value,
        email: document.getElementById('settingEmail').value,
        address: document.getElementById('settingAddress').value,
        whatsapp: document.getElementById('settingWhatsapp').value
    };
    db.ref('siteSettings').set(settings).then(() => {
        alert('Business Settings Updated!');
    });
}

function loadSiteSettings() {
    db.ref('siteSettings').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && document.getElementById('settingPhone')) {
            document.getElementById('settingPhone').value = data.phone || '';
            document.getElementById('settingEmail').value = data.email || '';
            document.getElementById('settingAddress').value = data.address || '';
            document.getElementById('settingWhatsapp').value = data.whatsapp || '';
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

function openBookingModal(title) {
    document.getElementById('modalTitle').innerText = "Inquire for: " + title;
    document.getElementById('bookingModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function handleBooking(e) {
    e.preventDefault();
    alert('Thank you! Your inquiry has been sent.');
    closeModal();
}
