import { extractArticle } from './extractArticle';

// 监听来自 background.js 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startExtraction") {
    const articleData = extractArticle();
    console.log(articleData)
    chrome.runtime.sendMessage({
      action: 'articleExtracted',
      data: articleData
    });
  } else if (message.action === "checkScript") {
    // 返回一个响应，表示脚本已存在，避免重复注入
    sendResponse({ status: "scriptAlreadyInjected" });
  }
});