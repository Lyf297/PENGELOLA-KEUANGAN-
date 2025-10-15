
const user = localStorage.getItem('loggedInUser');
if (!user) {
  alert('Silakan login dulu!');
  window.location.href = 'index.html';
}

const storageKey = `transactions_${user}`;
let transactions = JSON.parse(localStorage.getItem(storageKey)) || [];

const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');

function updateLocalStorage() {
  localStorage.setItem(storageKey, JSON.stringify(transactions));
}

function updateValues() {
  const incomes = transactions.filter(t => t.type === 'income').map(t => t.amount);
  const expenses = transactions.filter(t => t.type === 'expense').map(t => t.amount);

  const totalIncome = incomes.reduce((a, b) => a + b, 0);
  const totalExpense = expenses.reduce((a, b) => a + b, 0);
  const balanceAmount = totalIncome - totalExpense;

  balance.innerText = `Rp ${balanceAmount}`;
  money_plus.innerText = `+Rp${totalIncome}`;
  money_minus.innerText = `-Rp${totalExpense}`;
}

function addTransactionDOM(transaction) {
  const sign = transaction.type === 'income' ? '+' : '-';
  const item = document.createElement('li');
  item.classList.add(transaction.type === 'income' ? 'plus' : 'minus');
  item.innerHTML = `
    ${transaction.text} <span>${sign}Rp${transaction.amount}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Isi semua field!');
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    type: type.value
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  text.value = '';
  amount.value = '';
});

init();

// BUTOON LOGOUT
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'index.html';
    });