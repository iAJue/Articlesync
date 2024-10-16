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
    if (message.action === "articleExtracted") {
        chrome.storage.local.set({ article: message.data }, () => {
            chrome.windows.getCurrent((currentWindow) => {
                const width = Math.round(currentWindow.width * 0.85);
                const height = Math.round(currentWindow.height * 0.8);
                const left = Math.round((currentWindow.width - width) / 2 + currentWindow.left);
                const top = Math.round((currentWindow.height - height) / 2 + currentWindow.top);
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    var currentTab = tabs[0];
                    chrome.windows.create({
                        url: "sync/sync.html?currentUrl=" + encodeURIComponent(currentTab.url),
                        type: "popup",
                        width: width,
                        height: height,
                        left: left,
                        top: top
                    });
                });
            });
        });
    }
});

// 注册监听器，监听指定的 URL 请求
chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
        {
            "id": 1,
            "priority": 1,
            "action": {
                "type": "modifyHeaders",
                "requestHeaders": [
                    { "header": "Origin", "operation": "set", "value": "https://card.weibo.com" },
                    { "header": "Referer", "operation": "set", "value": "https://card.weibo.com/article/v3/editor" }
                ]
            },
            "condition": {
                "urlFilter": "https://card.weibo.com/article/v3/*",
                "resourceTypes": ["xmlhttprequest"]
            }
        },
        {
            "id": 2,
            "priority": 1,
            "action": {
                "type": "modifyHeaders",
                "requestHeaders": [
                    { "header": "Origin", "operation": "set", "value": "https://member.bilibili.com" }
                ]
            },
            "condition": {
                "urlFilter": "https://api.bilibili.com/x/article/creative/*",
                "resourceTypes": ["xmlhttprequest"]
            }
        }
    ],
    removeRuleIds: [1, 2]
});