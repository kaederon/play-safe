let dosesRecorded = -1;
const maxDosageInput = document.getElementById("max-dose");
const increaseDoseButton = document.getElementById("increase-dose");
const decreaseDoseButton = document.getElementById("decrease-dose");

function increaseDose() {
  let currentDose = parseFloat(maxDosageInput.value);
  currentDose += 0.1;
  maxDosageInput.value = currentDose.toFixed(1);
}

function decreaseDose() {
  let currentDose = parseFloat(maxDosageInput.value);
  if (currentDose > 0) {
    currentDose -= 0.1;
    maxDosageInput.value = currentDose.toFixed(1);
  }
}

increaseDoseButton.addEventListener("click", increaseDose);
decreaseDoseButton.addEventListener("click", decreaseDose);

function getMinDosage() {
  return 0; // Always return 0 as the minimum dosage
}

function getMaxDosage() {
  return parseFloat(maxDosageInput.value);
}

const timeLimit = 9000; // Time limit in seconds (e.g., 1 hour = 3600 seconds)

function calculateRecommendedDosage(elapsedTimeInSeconds) {
  const minDosage = getMinDosage();
  const maxDosage = getMaxDosage();
  const dosageRate = (maxDosage - minDosage) / timeLimit;

  if (dosesRecorded === -1) {
    return maxDosage;
  }

  let recommendedDosage = minDosage + (dosageRate * elapsedTimeInSeconds);
  recommendedDosage = Math.min(recommendedDosage, maxDosage); // Cap the dosage at the maximum value
  return recommendedDosage;
}

const dosageValueElement = document.getElementById("dosage-value");

// This function should be called whenever the elapsed time changes, e.g., every second
function updateDosageRecommendation(elapsedTimeInSeconds) {
  const recommendedDosage = calculateRecommendedDosage(elapsedTimeInSeconds);
  dosageValueElement.textContent = recommendedDosage.toFixed(1); // Use toFixed(1) here
}


let timer;
let elapsedTimeInSeconds = 0;
const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatElapsedTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

let startTime;

function startTimer() {
  if (!timer) {
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  const currentTime = new Date();
  elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
  timerElement.textContent = formatTime(elapsedTimeInSeconds);
  updateDosageRecommendation(elapsedTimeInSeconds);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  stopTimer();
  startTime = new Date();
  updateTimer();
}

const doseButton = document.getElementById("dose");
const doseList = document.getElementById("dose-list");

function deleteRow(event) {
  const rowToDelete = event.target.parentNode;
  doseList.removeChild(rowToDelete);
  dosesRecorded--; // Decrement the dosesRecorded variable
}

function recordDose() {
  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const elapsedTime = formatTime(elapsedTimeInSeconds);
  const recommendedDosage = calculateRecommendedDosage(elapsedTimeInSeconds);

  const tableRow = document.createElement("tr");

  const timeCell = document.createElement("td");
  timeCell.textContent = timeString;
  tableRow.appendChild(timeCell);

  const doseCell = document.createElement("td");
  doseCell.textContent = `${recommendedDosage.toFixed(1)} ml`;
  tableRow.appendChild(doseCell);

  const elapsedTimeCell = document.createElement("td");
  elapsedTimeCell.textContent = elapsedTime;
  tableRow.appendChild(elapsedTimeCell);

  const deleteCell = document.createElement("td");
  deleteCell.textContent = "X";
  deleteCell.style.cursor = "pointer"; // Change the cursor to a pointer when hovering over the "X"
  deleteCell.addEventListener("click", deleteRow);
  tableRow.appendChild(deleteCell);

  if (doseList.firstChild) {
    doseList.insertBefore(tableRow, doseList.firstChild);
  } else {
    doseList.appendChild(tableRow);
  }

  dosesRecorded++; // Increment the dosesRecorded variable
  resetTimer();
  startTimer();
}

doseButton.addEventListener("click", recordDose);
updateDosageRecommendation(elapsedTimeInSeconds);
