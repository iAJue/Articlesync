// 注册右键
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "sync-article",
        title: "同步文章",
        contexts: ["page", "selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    // 监控右键点击事件,注入提取文章脚本
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
    // 接收文章提取完成的消息
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

// 注册监听器，监听指定的 URL 请求
chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        "id": 1, // 每个规则都有唯一的 ID
        "priority": 1, // 优先级
        "action": {
          "type": "modifyHeaders", // 动作类型是修改请求头
          "requestHeaders": [
            { "header": "cookie", "operation": "set", "value": "your_cookie_value" }
          ]
        },
        "condition": {
          "urlFilter": "api.bilibili.com", // 只对这个域名生效
          "resourceTypes": ["xmlhttprequest"] // 过滤特定请求类型
        }
      },
    ],
    removeRuleIds: [1]

  });