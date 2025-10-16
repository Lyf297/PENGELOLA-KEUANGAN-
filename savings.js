// ======== CEK LOGIN ========
const user = localStorage.getItem('loggedInUser');
if (!user) {
  alert('Silakan login dulu!');
  window.location.href = 'index.html';
}

// ======== DATA ========
const savingsKey = `savings_${user}`;
let savings = JSON.parse(localStorage.getItem(savingsKey)) || [];

const savingsForm = document.getElementById('savingsForm');
const savingsList = document.getElementById('savingsList');
const savingsName = document.getElementById('savingsName');
const savingsGoal = document.getElementById('savingsGoal');
const backDashboard = document.getElementById('backDashboard');

// ======== NAVIGASI ========
backDashboard.addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

// ======== SIMPAN DATA ========
function saveData() {
  localStorage.setItem(savingsKey, JSON.stringify(savings));
}

// ======== RENDER LIST ========
function renderSavings() {
  savingsList.innerHTML = '';
  if (savings.length === 0) {
    savingsList.innerHTML = '<p style="text-align:center;">Belum ada tabungan</p>';
    return;
  }

  savings.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="saving-info">
        <strong>${item.name}</strong>
        <p>Total: Rp${item.total.toLocaleString()} ${item.goal ? `/ Target: Rp${item.goal.toLocaleString()}` : ''}</p>
      </div>
      <div class="saving-actions">
        <button title="Tambah Tabungan" onclick="addToSaving(${item.id})">➕</button>
        <button title="Ganti Nama" onclick="renameSaving(${item.id})">✏️</button>
        <button title="Hapus Tabungan" onclick="deleteSaving(${item.id})">🗑️</button>
      </div>
    `;
    savingsList.appendChild(li);
  });
}
// ======== SISTEM MODAL ========
const modalContainer = document.getElementById('modalContainer');
const modalTitle = document.getElementById('modalTitle');
const modalInput = document.getElementById('modalInput');
const modalOk = document.getElementById('modalOk');
const modalCancel = document.getElementById('modalCancel');

function showModal(message) {
  return new Promise((resolve) => {
    modalInput.style.display = "none";
    modalTitle.innerText = message;
    modalContainer.style.display = "flex";
    modalOk.onclick = () => { modalContainer.style.display = "none"; resolve(true); };
    modalCancel.onclick = () => { modalContainer.style.display = "none"; resolve(false); };
  });
}

function showPrompt(message, placeholder = "") {
  return new Promise((resolve) => {
    modalInput.style.display = "block";
    modalInput.value = placeholder;
    modalTitle.innerText = message;
    modalContainer.style.display = "flex";
    modalOk.onclick = () => {
      const value = modalInput.value.trim();
      modalContainer.style.display = "none";
      resolve(value || null);
    };
    modalCancel.onclick = () => {
      modalContainer.style.display = "none";
      resolve(null);
    };
  });
}

function showConfirm(message) {
  return new Promise((resolve) => {
    modalInput.style.display = "none";
    modalTitle.innerText = message;
    modalContainer.style.display = "flex";
    modalOk.onclick = () => { modalContainer.style.display = "none"; resolve(true); };
    modalCancel.onclick = () => { modalContainer.style.display = "none"; resolve(false); };
  });
}

// ======== AKSI ========
window.addToSaving = async function(id) {
  const item = savings.find(s => s.id === id);
  const amountStr = await showPrompt(`Masukkan jumlah untuk tabungan "${item.name}":`);
  if (!amountStr || isNaN(+amountStr) || +amountStr <= 0) {
    await showModal('Nominal tidak valid!');
    return;
  }
  item.total += +amountStr;
  saveData();
  renderSavings();
  await showModal('Berhasil menambahkan tabungan!');
};

window.renameSaving = async function(id) {
  const item = savings.find(s => s.id === id);
  const newName = await showPrompt('Masukkan nama baru tabungan:', item.name);
  if (!newName) return;
  item.name = newName;
  saveData();
  renderSavings();
  await showModal('Nama tabungan berhasil diganti!');
};

window.deleteSaving = async function(id) {
  if (await showConfirm('Yakin ingin hapus tabungan ini?')) {
    savings = savings.filter(s => s.id !== id);
    saveData();
    renderSavings();
    await showModal('Tabungan telah dihapus.');
  }
};

// ======== TAMBAH TUJUAN BARU ========
savingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newSaving = {
    id: Date.now(),
    name: savingsName.value,
    total: 0,
    goal: savingsGoal.value ? +savingsGoal.value : null
  };
  savings.push(newSaving);
  saveData();
  renderSavings();
  savingsForm.reset();
  await showModal('Tujuan tabungan berhasil ditambahkan!');
});

renderSavings();