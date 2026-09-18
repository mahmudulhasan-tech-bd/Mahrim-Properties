// Dropdown Toggle Logic
function toggleDropdown(btn) {
    // Close other open dropdowns first
    document.querySelectorAll('.action-dropdown').forEach(d => {
        if (d !== btn.nextElementSibling) d.classList.remove('show');
    });

    const dropdown = btn.nextElementSibling;
    dropdown.classList.toggle('show');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-col')) {
        document.querySelectorAll('.action-dropdown').forEach(d => d.classList.remove('show'));
    }
});

// Admin Filter Input logic
function filterAdminTable() {
    const input = document.getElementById('adminTableSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#adminPropertyTable tbody tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
}