
const savedBalance = localStorage.getItem("nexamime_demo_balance");

let balance = savedBalance !== null
  ? Number(savedBalance)
  : 0.00001250;

if (!Number.isFinite(balance)) {
  balance = 0.00001250;
}

let mining = false;
let miningTimer = null;

const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");
const messageDisplay = document.getElementById("message");

function updateBalance() {
  balanceDisplay.textContent = balance.toFixed(8) + " BTC";

  // Save the demo balance on this device
  localStorage.setItem("nexamime_demo_balance", balance.toFixed(8));
}

document.getElementById("start").addEventListener("click", function () {
  if (mining) return;

  mining = true;
  statusDisplay.textContent = "Running";
  messageDisplay.textContent =
    "Demo session running. No real mining is taking place.";

  miningTimer = setInterval(function () {
    balance += 0.00000001;
    updateBalance();
  }, 3000);
});

document.getElementById("pause").addEventListener("click", function () {
  mining = false;
  clearInterval(miningTimer);

  statusDisplay.textContent = "Paused";
  messageDisplay.textContent = "Demo session paused.";
});

updateBalance();
