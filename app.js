
const STORAGE_KEY = "nexamime_demo_balance";
const HISTORY_KEY = "nexamime_demo_transactions";

let balance = Number(
  localStorage.getItem(STORAGE_KEY) || "0.00001250"
);

if (!Number.isFinite(balance)) {
  balance = 0.00001250;
}

let mining = false;
let miningTimer = null;

const balanceDisplay = document.getElementById("balance");
const walletBalance = document.getElementById("walletBalance");
const statusDisplay = document.getElementById("status");
const messageDisplay = document.getElementById("message");
const transactionsDisplay = document.getElementById("transactions");

let transactions = JSON.parse(
  localStorage.getItem(HISTORY_KEY) || "[]"
);

function updateBalance() {
  const formatted = balance.toFixed(8) + " BTC";

  balanceDisplay.textContent = formatted;
  walletBalance.textContent = formatted;

  localStorage.setItem(STORAGE_KEY, balance.toFixed(8));
}

function updateTransactions() {
  if (transactions.length === 0) {
    transactionsDisplay.innerHTML =
      "<p>No demo transactions yet.</p>";
    return;
  }

  transactionsDisplay.innerHTML = transactions
    .map(item => `
      <div class="transaction">
        <strong>Demo mining reward</strong>
        <p>+${item.amount} BTC</p>
        <small>${item.date}</small>
      </div>
    `)
    .join("");
}

document.getElementById("start").addEventListener("click", function () {
  if (mining) return;

  mining = true;
  statusDisplay.textContent = "Running";
  messageDisplay.textContent =
    "Demo session running. No real mining is taking place.";

  miningTimer = setInterval(function () {
    balance += 0.00000001;

    const reward = "0.00000001";

    transactions.unshift({
      amount: reward,
      date: new Date().toLocaleString()
    });

    transactions = transactions.slice(0, 10);

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(transactions)
    );

    updateBalance();
    updateTransactions();
  }, 3000);
});

document.getElementById("pause").addEventListener("click", function () {
  mining = false;
  clearInterval(miningTimer);

  statusDisplay.textContent = "Paused";
  messageDisplay.textContent = "Demo session paused.";
});

document.getElementById("copyAddress").addEventListener("click", async function () {
  const address = document.getElementById("walletAddress").textContent;
  const copyMessage = document.getElementById("copyMessage");

  try {
    await navigator.clipboard.writeText(address);
    copyMessage.textContent = "Demo address copied!";
  } catch (error) {
    copyMessage.textContent =
      "Copy unavailable. Please select the address manually.";
  }
});

updateBalance();
updateTransactions();
