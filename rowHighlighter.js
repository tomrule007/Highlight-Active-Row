console.log('highlight-active-row: rowHighlighter Injected!');

// Attach focus/blur listeners to all 'inputs' in a 'table'
[...document.querySelectorAll('table input')].forEach(tableInput => {
  tableInput.addEventListener('focus', onFocus);
  tableInput.addEventListener('blur', onBlur);
});

function onFocus(event) {
  setStyle(
    getRowNode(event.target),
    'font-weight: bold;transform: scale(1.05); background-color: yellow; outline: thin solid'
  );
}

function onBlur(event) {
  setStyle(getRowNode(event.target), '');
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
    if (MAX_DEPTH === i + 1)
      console.log(
        'highlight-active-row: Unable to find Row Element. Increase MAX_DEPTH'
      );
  }
  return rowNode;
}

function setStyle(el, style) {
  el && (el.style.cssText = style);
}
