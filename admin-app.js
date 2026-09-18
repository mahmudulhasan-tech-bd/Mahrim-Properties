// Data Stores
let propertiesList = [
    { id: "TP-101", title: "Luxury 3 Bedroom Apartment", location: "Uttara Sector 10, Dhaka", owner: "Agent Mahmud", price: 12500000, status: "Approved", category: "Properties", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=100&q=80" },
    { id: "TP-102", title: "Modern Duplex Penthouse", location: "Gulshan 2, Dhaka", owner: "Kazi Rahman", price: 38000000, status: "Pending", category: "Properties", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80" }
];

let usersList = [
    { id: "USR-01", name: "Tanvir Ahmed", email: "tanvir@gmail.com", role: "User", status: "Active" },
    { id: "USR-02", name: "Rahim Chowdhury", email: "rahim@gmail.com", role: "User", status: "Active" }
];

let agentsList = [
    { id: "AGT-01", name: "Agent Mahmud", email: "mahmud@tasnim.com", role: "Agent", status: "Approved" },
    { id: "AGT-02", name: "Kazi Rahman", email: "kazi@tasnim.com", role: "Agent", status: "Pending" }
];

let currentTab = 'Dashboard';

// 1. Render Table Content
function renderTable(type) {
    const tableHead = document.getElementById('tableHeadRow');
    const tableBody = document.getElementById('tableBody');
    const sectionTitle = document.getElementById('tableSectionTitle');
    
    if (!tableBody || !tableHead) return;
    tableBody.innerHTML = '';

    if (type === 'Users') {
        if (sectionTitle) sectionTitle.innerText = "System Users List";
        tableHead.innerHTML = `
            <th>USER ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ROLE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>`;

        usersList.forEach(u => {
            tableBody.innerHTML += `
                <tr>
                    <td><strong>${u.id}</strong></td>
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td>${u.role}</td>
                    <td><span class="badge status-approved">${u.status}</span></td>
                    <td class="action-col">
                        <button class="btn-action" onclick="toggleActionDropdown(event)"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div class="action-dropdown">
                            <a href="#" onclick="alert('Viewing User: ${u.name}')"><i class="fa-regular fa-eye"></i> View User</a>
                            <a href="#" class="text-danger" onclick="deleteUser('${u.id}')"><i class="fa-regular fa-trash-can"></i> Remove</a>
                        </div>
                    </td>
                </tr>`;
        });

    } else if (type === 'Agents') {
        if (sectionTitle) sectionTitle.innerText = "Registered Agents List";
        tableHead.innerHTML = `
            <th>AGENT ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>STATUS</th>
            <th>ACTIONS</th>`;

        agentsList.forEach(a => {
            tableBody.innerHTML += `
                <tr>
                    <td><strong>${a.id}</strong></td>
                    <td>${a.name}</td>
                    <td>${a.email}</td>
                    <td><span class="badge ${a.status === 'Approved' ? 'status-approved' : 'status-pending'}">${a.status}</span></td>
                    <td class="action-col">
                        <button class="btn-action" onclick="toggleActionDropdown(event)"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div class="action-dropdown">
                            <a href="#" onclick="approveAgent('${a.id}')"><i class="fa-solid fa-check"></i> Approve Agent</a>
                            <a href="#" class="text-danger" onclick="deleteAgent('${a.id}')"><i class="fa-regular fa-trash-can"></i> Delete</a>
                        </div>
                    </td>
                </tr>`;
        });

    } else {
        // Dashboard, Properties, Hotels, Projects
        if (sectionTitle) sectionTitle.innerText = `${type} Review Queue`;
        tableHead.innerHTML = `
            <th>PROPERTY</th>
            <th>OWNER / AGENT</th>
            <th>PRICE (BDT)</th>
            <th>STATUS</th>
            <th>ACTIONS</th>`;

        const displayItems = (type === 'Dashboard' || type === 'Properties') 
            ? propertiesList 
            : propertiesList.filter(p => p.category.toLowerCase() === type.toLowerCase());

        displayItems.forEach(p => {
            const formattedPrice = p.price.toLocaleString('en-BD');
            const statusClass = p.status === 'Approved' ? 'status-approved' : 'status-pending';
            
            tableBody.innerHTML += `
                <tr>
                    <td class="prop-col">
                        <img src="${p.image}" alt="Img" style="width: 45px; height: 45px; border-radius: 6px; object-fit: cover;">
                        <div style="display:inline-block; margin-left: 10px; vertical-align: middle;">
                            <strong style="display:block;">${p.title}</strong>
                            <small style="color: #64748b;">${p.location}</small>
                        </div>
                    </td>
                    <td>${p.owner}</td>
                    <td>৳ ${formattedPrice}</td>
                    <td><span class="badge ${statusClass}">${p.status}</span></td>
                    <td class="action-col">
                        <button class="btn-action" onclick="toggleActionDropdown(event)"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div class="action-dropdown">
                            <a href="#" onclick="alert('Viewing details for ${p.id}')"><i class="fa-regular fa-eye"></i> View Details</a>
                            <a href="#" onclick="updatePropertyStatus('${p.id}', 'Approved')"><i class="fa-solid fa-check"></i> Approve</a>
                            <a href="#" onclick="updatePropertyStatus('${p.id}', 'Pending')"><i class="fa-solid fa-clock"></i> Set Pending</a>
                            <a href="#" class="text-danger" onclick="deleteProperty('${p.id}')"><i class="fa-regular fa-trash-can"></i> Delete</a>
                        </div>
                    </td>
                </tr>`;
        });
    }
}

// 2. Action Menu Dropdown Toggle
function toggleActionDropdown(e) {
    e.stopPropagation();
    document.querySelectorAll('.action-dropdown').forEach(d => d.classList.remove('show'));
    const dropdown = e.currentTarget.nextElementSibling;
    if (dropdown) dropdown.classList.toggle('show');
}

document.addEventListener('click', () => {
    document.querySelectorAll('.action-dropdown').forEach(d => d.classList.remove('show'));
});

// 3. Button Actions: Approve / Delete Logic
function updatePropertyStatus(id, newStatus) {
    const item = propertiesList.find(p => p.id === id);
    if (item) {
        item.status = newStatus;
        alert(`Property ${id} is now ${newStatus}`);
        renderTable(currentTab);
    }
}

function deleteProperty(id) {
    if (confirm(`Delete property ${id}?`)) {
        propertiesList = propertiesList.filter(p => p.id !== id);
        renderTable(currentTab);
    }
}

function approveAgent(id) {
    const agent = agentsList.find(a => a.id === id);
    if (agent) {
        agent.status = 'Approved';
        alert(`Agent ${agent.name} Approved!`);
        renderTable(currentTab);
    }
}

function deleteUser(id) {
    if (confirm("Are you sure you want to delete this user?")) {
        usersList = usersList.filter(u => u.id !== id);
        renderTable(currentTab);
    }
}

// 4. Table Filter / Search Trigger
function filterAdminTable() {
    const searchVal = (document.getElementById('adminTableSearch')?.value || document.getElementById('globalAdminSearch')?.value || '').toLowerCase().trim();
    const rows = document.querySelectorAll('#tableBody tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(searchVal) ? '' : 'none';
    });
}

// 5. Sidebar Navigation Link Attachments
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.sidebar-menu .nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const menuName = item.innerText.trim();
            currentTab = menuName;
            
            const titleEl = document.getElementById('adminPageTitle');
            if (titleEl) titleEl.innerText = `${menuName} Overview`;

            renderTable(menuName);
        });
    });

    // Initial Load
    renderTable('Dashboard');
});
