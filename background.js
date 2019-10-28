chrome.runtime.onInstalled.addListener(function() {
  let defaultStyle = {
    backgroundColor: '#FFFF00',
    scale: 1.05,
    bold: true,
    borderColor: '#000000',
    borderSize: 5
  };
  chrome.storage.sync.set(defaultStyle, function() {
    console.log('style: ', defaultStyle);
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['http', 'https'] }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
