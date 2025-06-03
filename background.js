// Background script para manejar la apertura de pestañas
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'openTab') {
    chrome.tabs.create({
      url: request.url,
      active: true
    });
  }
});