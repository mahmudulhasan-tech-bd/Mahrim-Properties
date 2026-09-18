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
let whatsappNumber = "+8801700000000";

document.addEventListener("DOMContentLoaded", () => {
    fetchProperties();
    loadSiteSettings();

    // Listen to Login Status
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('guestNav').style.display = 'none';
            document.getElementById('userNav').style.display = 'flex';
            document.getElementById('userNameDisplay').innerText = user.displayName || user.email.split('@')[0];
            closeUserModal();
        } else {
            document.getElementById('guestNav').style.display = 'block';
            document.getElementById('userNav').style.display = 'none';
        }
    });
});

// Modal UI Controllers
function openUserModal(type) {
    document.getElementById('userAuthModal').style.display = 'flex';
    switchModal(type);
}

function closeUserModal() {
    document.getElementById('userAuthModal').style.display = 'none';
}

function switchModal(type) {
    if (type === 'login') {
        document.getElementById('userLoginBox').style.display = 'block';
        document.getElementById('userSignupBox').style.display = 'none';
    } else {
        document.getElementById('userLoginBox').style.display = 'none';
        document.getElementById('userSignupBox').style.display = 'block';
    }
}

// 1. Email/Password Sign Up
function handleEmailSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const pass = document.getElementById('signupPass').value;

    auth.createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            return userCredential.user.updateProfile({ displayName: name });
        })
        .then(() => {
            alert('Account created successfully!');
        })
        .catch(err => alert('Sign Up Error: ' + err.message));
}

// 2. Email/Password Login
function handleEmailLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => alert('Logged in successfully!'))
        .catch(err => alert('Login Error: ' + err.message));
}

// 3. Google Sign-In
function handleGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => alert('Google Sign-In successful!'))
        .catch(err => alert('Google Auth Error: ' + err.message));
}

// 4. Facebook Sign-In
function handleFacebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => alert('Facebook Sign-In successful!'))
        .catch(err => alert('Facebook Auth Error: ' + err.message));
}

function handleUserLogout() {
    auth.signOut().then(() => alert('Logged Out!'));
}

// Fetch Properties
function fetchProperties() {
    db.ref('properties').on('value', (snapshot) => {
        allProperties = [];
        const data = snapshot.val();
        for (let id in data) {
            allProperties.push({ id, ...data[id] });
        }
        renderListings(allProperties);
    });
}

function loadSiteSettings() {
    db.ref('siteSettings').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.whatsapp) {
            whatsappNumber = data.whatsapp.replace(/[^0-9]/g, '');
        }
    });
}

function renderListings(properties) {
    const listContainer = document.getElementById('propertyList');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (properties.length === 0) {
        listContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No Properties Available.</p>';
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
                <button class="book-btn" onclick="sendWhatsAppInquiry('${item.title}', '${item.price}', '${item.location}')">
                    <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
                </button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function sendWhatsAppInquiry(title, price, location) {
    const currentUser = auth.currentUser;
    const userName = currentUser ? (currentUser.displayName || currentUser.email) : "Guest User";

    const text = `Hello Mahrim Properties! I am interested in this property:\n\n` +
                 `📌 *Property:* ${title}\n` +
                 `💰 *Price:* BDT ${price}\n` +
                 `📍 *Location:* ${location}\n\n` +
                 `👤 *Client Name:* ${userName}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
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
