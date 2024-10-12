chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sync-article",
    title: "同步文章",
    contexts: ["page", "selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sync-article") {
    chrome.tabs.sendMessage(tab.id, { action: "checkScript" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['contentScript.js']  
        }).then(() => {
          chrome.tabs.sendMessage(tab.id, { action: "startExtraction" });
        }).catch((error) => {
          console.error("脚本注入失败", error);
        });
      } else {
        chrome.tabs.sendMessage(tab.id, { action: "startExtraction" });
      }
    });
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "articleExtracted") {
    chrome.storage.local.set({ article: message.data }, () => {
      chrome.windows.getCurrent((currentWindow) => {
        const width = Math.round(currentWindow.width * 0.8);
        const height = Math.round(currentWindow.height * 0.8);
        const left = Math.round((currentWindow.width - width) / 2 + currentWindow.left);
        const top = Math.round((currentWindow.height - height) / 2 + currentWindow.top);
        chrome.windows.create({
          url: "sync/sync.html",  
          type: "popup",
          width: width,
          height: height,
          left: left,
          top: top
        });
      });
    });
  }
});