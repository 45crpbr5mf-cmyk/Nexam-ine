
const STORAGE_KEY = "nexamime_demo_balance";
const HISTORY_KEY = "nexamime_demo_transactions";
const STATS_KEY = "nexamime_demo_stats";

let balance = Number(localStorage.getItem(STORAGE_KEY) || "0.00001250");
if (!Number.isFinite(balance)) balance = 0.00001250;

let transactions = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
let stats = JSON.parse(localStorage.getItem(STATS_KEY) || "null") || {
  sessions: 0,
  seconds: 0,
  rewards: 0,
  activity: []
};

let mining = false;
let miningTimer = null;
let sessionTimer = null;

const balanceDisplay = document.getElementById("balance");
const walletBalance = document.getElementById("walletBalance");
const statusDisplay = document.getElementById("status");
const messageDisplay = document.getElementById("message");
const transactionsDisplay = document.getElementById("transactions");

function saveData() {
  localStorage.setItem(STORAGE_KEY, balance.toFixed(8));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(transactions));
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function updateBalance() {
  const formatted = balance.toFixed(8) + " BTC";
  balanceDisplay.textContent = formatted;
  walletBalance.textContent = formatted;
  saveData();
}

function updateTransactions() {
  if (!transactions.length) {
    transactionsDisplay.innerHTML = "<p>No demo transactions yet.</p>";
    return;
  }

  transactionsDisplay.innerHTML = transactions.map(item => `
    <div class="transaction">
      <strong>Demo mining reward</strong>
      <p>+${item.amount} BTC</p>
      <small>${item.date}</small>
    </div>
  `).join("");
}

function updateStatistics() {
  document.getElementById("totalRewards").textContent =
    stats.rewards.toFixed(8) + " BTC";

  document.getElementById("totalSessions").textContent =
    stats.sessions;

  document.getElementById("totalMiningTime").textContent =
    Math.floor(stats.seconds / 60) + " min";

  document.getElementById("liveHashrate").textContent =
    mining ? "125.4 GH/s" : "0 GH/s";

  const chart = document.getElementById("activityChart");

  if (!stats.activity.length) {
    chart.innerHTML = '<p class="muted">Start a demo session to see activity.</p>';
    return;
  }

  const values = stats.activity.slice(-12);
  const max = Math.max(...values, 1);

  chart.innerHTML = values.map(value => `
  <div title="${value} demo rewards"
    style="flex:1;min-width:0;
    height:${Math.max(8, value / max * 75)}px;
    margin:0 5px;
    background:#27d69a;
    border-radius:5px 5px 0 0;">
  </div>
`).join("");
}

function recordReward() {
  balance += 0.00000001;
  stats.rewards += 0.00000001;

  transactions.unshift({
    amount: "0.00000001",
    date: new Date().toLocaleString()
  });

  transactions = transactions.slice(0, 10);

  stats.activity.push(1);
stats.activity = stats.activity.slice(-12);

  updateBalance();
  updateTransactions();
  updateStatistics();
  saveData();
}

function startMining() {
  if (mining) return;

  mining = true;
  stats.sessions += 1;

  statusDisplay.textContent = "Running";
  messageDisplay.textContent =
    "Demo session running. No real mining is taking place.";

  updateStatistics();
  saveData();

  miningTimer = setInterval(recordReward, 3000);

  sessionTimer = setInterval(function () {
    stats.seconds += 1;
    updateStatistics();
    saveData();
  }, 1000);
}

function pauseMining() {
  if (!mining) return;

  mining = false;
  clearInterval(miningTimer);
  clearInterval(sessionTimer);

  statusDisplay.textContent = "Paused";
  messageDisplay.textContent = "Demo session paused.";

  updateStatistics();
  saveData();
}

document.getElementById("start").addEventListener("click", startMining);
document.getElementById("pause").addEventListener("click", pauseMining);

document.getElementById("copyAddress").addEventListener("click", async function () {
  const address = document.getElementById("walletAddress").textContent;
  const copyMessage = document.getElementById("copyMessage");

  try {
    await navigator.clipboard.writeText(address);
    copyMessage.textContent = "Demo address copied!";
  } catch (error) {
    copyMessage.textContent = "Copy unavailable. Please select the address manually.";
  }
});

updateBalance();
updateTransactions();
updateStatistics();
