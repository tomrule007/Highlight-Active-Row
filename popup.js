let changeColor = document.getElementById('changeColor');
let save = document.getElementById('save');
let reset = document.getElementById('reset');
chrome.storage.sync.get('defaultStyle', function(data) {
  console.log('popup style: ', data.defaultStyle);
});

save.onClick = function saveSettings() {
  console.log('saveSettings');
};

reset.onClick = function resetSettings() {
  console.log('resetSettings');
};
