let dosesRecorded = -1;
let doseHistory = []; // Added doseHistory array to store the dose history
const maxDosageInput = document.getElementById("max-dose");

const increaseDoseButton = document.getElementById("increase-dose");

function increaseDose() {
  let currentDose = parseFloat(maxDosageInput.value);
  currentDose += 0.1;
  maxDosageInput.value = currentDose.toFixed(1);
}

increaseDoseButton.addEventListener("click", increaseDose);

const decreaseDoseButton = document.getElementById("decrease-dose");

function decreaseDose() {
  let currentDose = parseFloat(maxDosageInput.value);
  if (currentDose > 0) {
    currentDose -= 0.1;
    maxDosageInput.value = currentDose.toFixed(1);
  }
}

decreaseDoseButton.addEventListener("click", decreaseDose);

function getMinDosage() {
  return 0; // Always return 0 as the minimum dosage
}

function getMaxDosage() {
  return parseFloat(maxDosageInput.value);
}

// Update the calculateRecommendedDosage function
function calculateRecommendedDosage(elapsedTimeInSeconds) {
  const minDosage = getMinDosage();
  const maxDosage = getMaxDosage();
  const totalDoseLimit = dosesRecorded === 0 ? maxDosage * 1.2 : maxDosage * 2;

  const currentSystemDose = doseHistory.reduce((accumulator, dose) => {
    const doseElapsedTime = elapsedTimeInSeconds - dose.time;
    const doseRemaining = dose.amount * Math.max(0, (3 * 3600 - doseElapsedTime) / (3 * 3600));
    return accumulator + doseRemaining;
  }, 0);

  let recommendedDosage = totalDoseLimit - currentSystemDose;
  recommendedDosage = Math.max(recommendedDosage, minDosage); // Ensure the dosage is not less than the minimum value
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
  doseHistory.pop(); // Remove the last dose from doseHistory
}

function recordDose() {
  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const elapsedTime = formatTime(elapsedTimeInSeconds);
  const recommendedDosage = calculateRecommendedDosage(elapsedTimeInSeconds);

  doseHistory.push({
    time: elapsedTimeInSeconds,
    amount: recommendedDosage,
  }); // Add the new dose to the doseHistory array

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
  const deleteButton = document.createElement("span");
  deleteButton.textContent = "X";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", deleteRow);
  deleteCell.appendChild(deleteButton);
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

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);
