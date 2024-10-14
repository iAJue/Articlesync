import { extractArticle } from './extractArticle';
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startExtraction") {
        const articleData = extractArticle();
        chrome.runtime.sendMessage({
            action: 'articleExtracted',
            data: articleData
        });
    } else if (message.action === "checkScript") {
        sendResponse({ status: "scriptAlreadyInjected" });
    }
});