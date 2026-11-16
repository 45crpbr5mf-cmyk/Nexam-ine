
let balance = 0.00001250;
let mining = false;
let miningTimer = null;

const balanceDisplay = document.getElementById("balance");
const statusDisplay = document.getElementById("status");
const messageDisplay = document.getElementById("message");

function updateBalance() {
  balanceDisplay.textContent =
    balance.toFixed(8) + " BTC";
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
  messageDisplay.textContent =
    "Demo session paused.";
});

updateBalance();
