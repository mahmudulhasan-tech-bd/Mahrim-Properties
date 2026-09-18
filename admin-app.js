// Firebase Config & Firestore Initialization
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "tasnim-properties.firebaseapp.com",
    projectId: "tasnim-properties",
    storageBucket: "tasnim-properties.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = (typeof firebase !== 'undefined') ? firebase.firestore() : null;

// Mock Fallback Data (Database connect na thakle eita dekhabe)
let adminPropertiesData = [
    { id: "TP-101", title: "Luxury 3 Bedroom Apartment", location: "Uttara Sector 10, Dhaka", owner: "Agent Mahmud", price: 12500000, status: "Approved", category: "Properties", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=100&q=80" },
    { id: "TP-102", title: "Modern Duplex Penthouse", location: "Gulshan 2, Dhaka", owner: "Kazi Rahman", price: 38000000, status: "Pending", category: "Properties", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80" }
];

let adminUsersData = [
    { id: "USR-01", name: "Tanvir Ahmed", email: "tanvir@gmail.com", role: "User", status: "Active" },
    { id: "USR-02", name: "Rahim Chowdhury", email: "rahim@gmail.com", role: "User", status: "Active" }
];

let adminAgentsData = [
    { id: "AGT-01", name: "Agent Mahmud", email: "mahmud@tasnim.com", role: "Agent", status: "Approved" },
    { id: "AGT-02", name: "Kazi Rahman", email: "kazi@tasnim.com", role: "Agent", status: "Pending" }
];

let currentActiveView = 'Dashboard';

// 1. Sidebar Navigation Switcher (Users, Agents, Properties, Hotels, Projects, Dashboard)
function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.sidebar-menu .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const menuText = item.innerText.trim();
            currentActiveView = menuText;
            loadDataByMenu(menuText);
        });
    });
}

// 2. Load Table & Stats Data dynamically from Firebase/Array
function loadDataByMenu(menu) {
    const tableTitle = document.querySelector('.table-header h3');
    const tableHead = document.querySelector('#adminPropertyTable thead');
    const tableBody = document.querySelector('#adminPropertyTable tbody');

    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (menu === 'Users') {
        if (tableTitle) tableTitle.innerText = "System Users List";
        tableHead.innerHTML = `
            <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>`;
        
        fetchCollectionData('users', adminUsersData, (data) => {
            data.forEach(user => {
                tableBody.innerHTML += `
                    <tr>
                        <td><strong>${user.id}</strong></td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td><span class="badge status-approved">${user.status}</span></td>
                        <td class="action-col">
                            <button class="btn-action" onclick="toggleDropdown(this)"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                            <div class="action-dropdown">
                                <a href="#" onclick="alert('User ID: ${user.id}')"><i class="fa-regular fa-eye"></i> View</a>
                                <a href="#" class="text-danger" onclick="deleteUser('${user.id}')"><i class="fa-regular fa-trash-can"></i> Delete</a>
                            </div>
                        </td>
                    </tr>`;
            });
        });

    } else if (menu === 'Agents') {
        if (tableTitle) tableTitle.innerText = "Registered Agents List";
        tableHead.innerHTML = `
            <tr>
                <th>Agent ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>`;

        fetchCollectionData('agents', adminAgentsData, (data) => {
            data.forEach(agent => {
                tableBody.innerHTML += `
                    <tr>
                        <td><strong>${agent.id}</strong></td>
                        <td>${agent.name}</td>
                        <td>${agent.email}</td>
                        <td><span class="badge ${agent.status === 'Approved' ? 'status-approved' : 'status-pending'}">${agent.status}</span></td>
                        <td class="action-col">
                            <button class="btn-action" onclick="toggleDropdown(this)"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                            <div class="action-dropdown">
                                <a href="#" onclick="updateStatus('agents', '${agent.id}', 'Approved')"><i class="fa-solid fa-check"></i> Approve Agent</a>
                                <a href="#" class="text-danger" onclick="deleteUser('${agent.id}')"><i class="fa-regular fa-trash-can"></i> Remove</a>
                            </div>
                        </td>
                    </tr>`;
            });
        });

    } else {
        // Properties, Hotels, Projects, or Dashboard Review Queue
        if (tableTitle) tableTitle.innerText = `${menu} Review Queue`;
        tableHead.innerHTML = `
            <tr>
                <th>Property</th>
                <th>Owner / Agent</th>
                <th>Price (BDT)</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>`;

        fetchCollectionData('properties', adminPropertiesData, (data) => {
            const filtered = (menu === 'Dashboard' || menu === 'Properties') 
                ? data 
                : data.filter(item => item.category === menu);

            filtered.forEach(prop => {
                const formattedPrice = prop.price ? prop.price.toLocaleString('en-BD') : '0';
                tableBody.innerHTML += `
                    <tr>
                        <td class="prop-col">
                            <img src="${prop.image}" alt="Prop">
                            <div>
                                <strong>${prop.title}</strong>
                                <small>${prop.location}</small>
                            </div>
                        </td>
                        <td>${prop.owner}</td>
                        <td>৳ ${formattedPrice}</td>
                        <td><span class="badge ${prop.status === 'Approved' ? 'status-approved' : 'status-pending'}">${prop.status}</span></td>
                        <td class="action-col">
                            <button class="btn-action" onclick="toggleDropdown(this)"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                            <div class="action-dropdown">
                                <a href="#" onclick="alert('Viewing Details for: ${prop.id}')"><i class="fa-regular fa-eye"></i> View Details</a>
                                <a href="#" onclick="updatePropertyStatus('${prop.id}', 'Approved')"><i class="fa-solid fa-check"></i> Approve</a>
                                <a href="#" onclick="updatePropertyStatus('${prop.id}', 'Rejected')"><i class="fa-solid fa-xmark"></i> Reject</a>
                                <a href="#" class="text-danger" onclick="deleteProperty('${prop.id}')"><i class="fa-regular fa-trash-can"></i> Delete</a>
                            </div>
                        </td>
                    </tr>`;
            });
        });
    }
}

// 3. Helper to Fetch Data from Firebase or Array
function fetchCollectionData(collectionName, fallbackData, callback) {
    if (db) {
        db.collection(collectionName).get().then(snapshot => {
            let data = [];
            snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
            if (data.length > 0) callback(data);
            else callback(fallbackData);
        }).catch(() => callback(fallbackData));
    } else {
        callback(fallbackData);
    }
}

// 4. Action Buttons (Approve, Reject, Delete)
function updatePropertyStatus(id, newStatus) {
    if (db) {
        db.collection('properties').doc(id).update({ status: newStatus }).then(() => {
            alert(`Property ${id} updated to ${newStatus}`);
            loadDataByMenu(currentActiveView);
        });
    } else {
        const item = adminPropertiesData.find(p => p.id === id);
        if (item) item.status = newStatus;
        alert(`Property ${id} updated to ${newStatus}`);
        loadDataByMenu(currentActiveView);
    }
}

function deleteProperty(id) {
    if (confirm("Are you sure you want to delete this listing?")) {
        adminPropertiesData = adminPropertiesData.filter(p => p.id !== id);
        loadDataByMenu(currentActiveView);
    }
}

// 5. Dropdown Actions & Search Filters
function toggleDropdown(btn) {
    document.querySelectorAll('.action-dropdown').forEach(d => {
        if (d !== btn.nextElementSibling) d.classList.remove('show');
    });
    const dropdown = btn.nextElementSibling;
    if (dropdown) dropdown.classList.toggle('show');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-col')) {
        document.querySelectorAll('.action-dropdown').forEach(d => d.classList.remove('show'));
    }
});

function filterAdminTable() {
    const input = document.getElementById('adminTableSearch')?.value.toLowerCase() || '';
    const rows = document.querySelectorAll('#adminPropertyTable tbody tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(input) ? '' : 'none';
    });
}

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    setupSidebarNavigation();
    loadDataByMenu('Dashboard');
    
    const searchInput = document.getElementById('adminTableSearch');
    if (searchInput) searchInput.addEventListener('keyup', filterAdminTable);
});
