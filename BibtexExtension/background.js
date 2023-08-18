chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generateBibtex",
    title: "Copy Bibtex from Google Scholar",
    contexts: ["selection"],
  });
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.text === "getBibtex") {
      fetch(request.url)
        .then(response => response.text())
        .then(text => {
          // Copy text to clipboard
          const copyFrom = document.createElement("textarea");
          copyFrom.textContent = text;
          document.body.appendChild(copyFrom);
          copyFrom.select();
          document.execCommand('copy');
          copyFrom.blur();
          document.body.removeChild(copyFrom);
          console.log('Copying to clipboard was successful!');

          // Show notification
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'bibicon.png', 
            title: 'BibTeX Copied',
            message: text
          });
        })
        .catch(err => console.error('Error fetching URL: ', err));
    }
  }
);



chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generateBibtex") {
    var newURL = "https://scholar.google.com/scholar?q=" + info.selectionText + "#d=gs_cit";
    chrome.tabs.create({ url: newURL }, function(tab) {
      // Wait for the tab to finish loading
      chrome.tabs.onUpdated.addListener(function listener (tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          // remove this listener since we don't need it anymore
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.tabs.sendMessage(tabId, { text: "generateBibtex", selection: info.selectionText });
        }
      });
    });
  }
});
