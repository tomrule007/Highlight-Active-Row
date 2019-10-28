console.log('rowHighlighter Injected!');

// TODO: figure out how to sync style with background.js chrome.storage
const style =
  'font-weight: bold;transform: scale(1.05); background-color: yellow; outline: thin solid';

// Attach focus/blur listeners to all 'inputs' in a 'table'
[...document.querySelectorAll('table input')].forEach(tableInput => {
  tableInput.addEventListener('focus', onFocus);
  tableInput.addEventListener('blur', onBlur);
});

function onFocus(event) {
  setRowStyle(getRowNode(event.target), style);
}

function onBlur(event) {
  setRowStyle(getRowNode(event.target), '');
}

function getRowNode(el) {
  const MAX_DEPTH = 5;
  let rowNode;
  let curEl = el;
  for (let i = 0; i < MAX_DEPTH; i++) {
    if (curEl && curEl.tagName === 'TR') {
      rowNode = curEl;
      break;
    }
    curEl && (curEl = curEl.parentNode);
  }
  return rowNode;
}

function setRowStyle(rowNode, style) {
  rowNode && (rowNode.style.cssText = style);
}

// TODO: might be a solution to syncing style settings with background.js
document.addEventListener('rowHighlighterStyleUpdate', setStyle);

function setStyle(event) {
  console.log('updating style: ', event);
}
