import { 
  auth, db, 
  onAuthStateChanged, signOut,
  collection, doc, getDoc, updateDoc, deleteDoc, onSnapshot, addDoc, serverTimestamp 
} from "./firebase.js";

let adminUser = null;

document.addEventListener("DOMContentLoaded", () => {
  verifyAdminUser();
});

function verifyAdminUser() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (!snap.exists() || snap.data().role !== 'admin') {
      alert("Unauthorized: Admin role required.");
      await signOut(auth);
      window.location.href = "index.html";
      return;
    }
    adminUser = user;
    document.getElementById('adminEmailDisplay').innerText = user.email;
    loadAdminReviewQueue();
  });
}

function loadAdminReviewQueue() {
  const container = document.getElementById('adminPropertyList');
  if (!container) return;

  onSnapshot(collection(db, 'properties'), (snapshot) => {
    let rows = `<table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden;">
      <tr style="background:#e2e8f0; text-align:left;"><th style="padding:12px;">Title</th><th style="padding:12px;">Price</th><th style="padding:12px;">Status</th><th style="padding:12px;">Actions</th></tr>`;
    
    snapshot.forEach(docSnap => {
      const p = docSnap.data();
      const id = docSnap.id;
      rows += `<tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:12px;">${p.title}</td>
        <td style="padding:12px;">৳ ${Number(p.price || 0).toLocaleString()}</td>
        <td style="padding:12px; color:${p.status === 'approved' ? 'green' : 'orange'};">${p.status || 'pending'}</td>
        <td style="padding:12px;">
          <button onclick="approveProperty('${id}')" style="background:green; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Approve</button>
          <button onclick="deleteProperty('${id}')" style="background:red; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>
        </td>
      </tr>`;
    });
    rows += `</table>`;
    container.innerHTML = rows;
  });
}

window.approveProperty = async function(id) {
  try {
    await updateDoc(doc(db, 'properties', id), { status: 'approved' });
    await addDoc(collection(db, 'adminLogs'), { adminId: adminUser.uid, action: 'Approved property', targetId: id, timestamp: serverTimestamp() });
    alert("Property approved successfully.");
  } catch (err) {
    alert("Error: " + err.message);
  }
}

window.deleteProperty = async function(id) {
  if (confirm("Are you sure you want to delete this property?")) {
    try {
      await deleteDoc(doc(db, 'properties', id));
      await addDoc(collection(db, 'adminLogs'), { adminId: adminUser.uid, action: 'Deleted property', targetId: id, timestamp: serverTimestamp() });
      alert("Property deleted successfully.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  }
}