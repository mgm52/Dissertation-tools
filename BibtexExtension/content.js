  let lastGeneratedCitation = '';
  
  /*chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.text === 'generateBibtex') {
      lastGeneratedCitation = generateBibtex(msg.selection);
        navigator.clipboard.writeText(lastGeneratedCitation).then(() => {
            //clipboard successfully set
            console.log("Written to clipboard")
        }, () => {
            //clipboard write failed, use fallback
            console.log("Failed to write to clipboard")
        });
      // No need to send back the citation here
    } else if (msg.text === 'getBibtex') {
      console.log("Sending citation")
      sendResponse(lastGeneratedCitation);
    }  
});*/

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.text === "generateBibtex") {
        const button = document.querySelector('.gs_or_cit');
        if (button) {
          button.click();
          const observer = new MutationObserver(function() {
            const link = document.querySelector('.gs_citi');
            if (link) {
              // Send message to background script with the link
              chrome.runtime.sendMessage({ text: "getBibtex", url: link.href });
              observer.disconnect();  // Stop observing when we've found the link
            }
            const x = document.querySelector('.gs_btnCLS');
            if (x) {
                x.click();
            }
            else {
                console.log("No x found")
            }
          });
          // Start observing
          observer.observe(document.body, { childList: true, subtree: true });
        } else {
          console.log('No button found');
        }
      }
    }
  );
  
  
  
  


  
  function generateBibtex_OLD(selection) {
    const citation = `
      @misc{
        title = {${selection}},
        author = {Author},
        year = {Year},
        note = {Retrieved from [website URL]},
      }
    `;
  
    return citation;
  }