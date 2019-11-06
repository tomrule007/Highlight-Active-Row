// Event Listeners
document.getElementById('addRow').addEventListener('click', addRow);
document.getElementById('addInterval').addEventListener('click', addInterval);

document.getElementById('stopInterval').addEventListener('click', stopInterval);
document.getElementById('clearTable').addEventListener('click', clearTable);

// HTML Elements
const tbody = document.getElementById('tbody');

const intervalTime = document.getElementById('intervalTime');

// Global Variables
var rowCounter = 0;
var rowInterval;

// Functions

function clearTable(ev) {
  rowCounter = 0;
  tbody.innerHTML = '';
}

function addRow(ev) {
  console.log('addRow!');
  var row = document.createElement('tr');
  row.innerHTML = `<td>${rowCounter++}</td><td> Blah Blah Blah </td> <td><input type="text"></td>`;

  tbody.appendChild(row);
}
function stopInterval(ev) {
  clearInterval(rowInterval);
}
function addInterval(event) {
  console.log(+intervalTime.value);
  // check and clear old interval first
  if (rowInterval) clearInterval(rowInterval);
  rowInterval = setInterval(() => {
    addRow();
  }, +intervalTime.value);
}
