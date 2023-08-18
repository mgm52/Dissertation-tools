chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.text === "generateBibtex") {
        const link = document.querySelector('a');
        console.log("Hello! I am content.js");
        console.log(document);
        console.log(link.href);
      }
    }
  );
  