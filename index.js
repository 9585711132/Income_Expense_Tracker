const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');

// Get transactions from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add Transaction
form.addEventListener('submit', e => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: text.value.trim(),
    amount: +amount.value,
    type: type.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  form.reset();
});

// Render Transactions
function renderTransactions() {
  transactionList.innerHTML = '';

  transactions.forEach(tr => {
    const li = document.createElement('li');
    li.classList.add('transaction', tr.type);
    li.innerHTML = `
      <span>${tr.text}</span>
      <span>${tr.type === 'income' ? '+' : '-'}$${Math.abs(tr.amount)}</span>
      <div class="actions">
        <button onclick="editTransaction(${tr.id})">✏️</button>
        <button onclick="deleteTransaction(${tr.id})">🗑️</button>
      </div>
    `;
    transactionList.appendChild(li);
  });

  updateSummary();
}

// Edit Transaction
window.editTransaction = id => {
  const tr = transactions.find(t => t.id === id);
  if (!tr) return;

  text.value = tr.text;
  amount.value = tr.amount;
  type.value = tr.type;

  deleteTransaction(id);
};

// Delete Transaction
window.deleteTransaction = id => {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  renderTransactions();
};

// Update Summary
function updateSummary() {
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const total = incomeTotal - expenseTotal;

  income.textContent = `$${incomeTotal.toFixed(2)}`;
  expense.textContent = `$${expenseTotal.toFixed(2)}`;
  balance.textContent = `$${total.toFixed(2)}`;
}

// Update Local Storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize App
renderTransactions();