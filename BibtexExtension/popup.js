chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { text: 'getBibtex' }, (response) => {
      document.getElementById('output').value = response;
    });
  });
  
  