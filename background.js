let popupPort = null;

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== "popup") return;
  popupPort = port;
  port.onDisconnect.addListener(() => { popupPort = null; });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if ('audible' in changeInfo || 'mutedInfo' in changeInfo) {
    if (popupPort) {
      popupPort.postMessage({message: 'tabUpdated', data: tabId});
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'getTabs') {
    chrome.tabs.query({audible: true}, (tabs) => {
      sendResponse({data: tabs});
    });
  }
  return true;
});
