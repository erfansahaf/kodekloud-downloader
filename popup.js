"use strict";

function sendDownloadRequest(event) {
  let targetType = event.target.value;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // console.log("tab", tabs[0].id, tabs[0]);
    let message = { selection: targetType };
    chrome.tabs.sendMessage(tabs[0].id, message);
  });

  window.close();
}

document.getElementById("downloadText").addEventListener("click", sendDownloadRequest);
document.getElementById("downloadHtml").addEventListener("click", sendDownloadRequest);
document.getElementById("downloadScript").addEventListener("click", sendDownloadRequest);
// document.getElementById("logToConsole").addEventListener("click", sendDownloadRequest);
