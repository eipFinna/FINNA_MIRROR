chrome.contextMenus.onClicked.addListener(genericOnClick);

// A generic onclick callback function.
function genericOnClick(info) {
  const selectedText = info.selectionText;

  if (selectedText) {
    // Store the selected text in chrome.storage.local
    chrome.storage.local.set({ selectedText: selectedText }, function () {
      console.log("Selected text saved:", selectedText);
    });
  }}
chrome.runtime.onInstalled.addListener(function () {

  let title = "Chercher l'information sur Finna";
  chrome.contextMenus.create({
    title: title,
    contexts: ['selection'],
    id: 'selection',
  });

});
