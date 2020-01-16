// Use global state to prevent multiple injections
if (window.highlightActiveRowContentScriptInjected !== true) {
  window.highlightActiveRowContentScriptInjected = true; // global scope

  const defaultStyle = '';
  const highlightStyle =
    'font-weight: bold; background-color: yellow; outline: thin solid';

  const getRowNode = el => {
    const MAX_DEPTH = 5;
    let curEl = el;
    for (let i = 0; i < MAX_DEPTH; i++) {
      if (!curEl) return null;
      if (curEl.tagName === 'TR') return curEl;

      curEl = curEl.parentNode;
    }
    console.log(
      'highlight-active-row: Unable to find Row Element. Increase MAX_DEPTH'
    );
    return null;
  };

  const setStyle = (style, el) => {
    if (el) el.style.cssText = style;
  };

  const setRowStyle = style => ({ target }) =>
    setStyle(style, getRowNode(target));

  // Attach focusin/focusout listeners to the document;
  document.addEventListener('focusin', setRowStyle(highlightStyle), true);
  document.addEventListener('focusout', setRowStyle(defaultStyle), true);
}
