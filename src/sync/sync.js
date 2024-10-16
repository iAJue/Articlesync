import syncManager from '../core/syncManager';
import { extractArticle, htmlToMarkdown, htmlToText, markdownToHtml } from '../contents/extractArticle';

document.addEventListener('DOMContentLoaded', async () => {
    const platformsContainer = document.getElementById('platforms');
    const supportedPlatforms = await syncManager.getSupportedPlatforms();
    if (supportedPlatforms && supportedPlatforms.length > 0) {
        supportedPlatforms.forEach(platform => {
            const platformItem = document.createElement('div');
            platformItem.classList.add('platform-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = platform.value;
            checkbox.name = 'platform';
            checkbox.value = platform.value;
            checkbox.classList.add('checkbox');

            const label = document.createElement('label');
            label.setAttribute('for', platform.value);
            label.classList.add('platform-label');
            label.textContent = platform.label;

            platformItem.appendChild(checkbox);
            platformItem.appendChild(label);
            platformsContainer.appendChild(platformItem);
        });
    }

    // 从存储中加载文章数据
    chrome.storage.local.get(['article'], (result) => {
        if (result.article) {
            document.getElementById('title').value = result.article.title || "无标题";
            chrome.storage.local.get(['promoteToggle'], (res) => {
                let content = result.article.content || "无内容";
                if (res.promoteToggle != false ) {
                    content = addPromotion(content)
                }
                document.getElementById('content').innerHTML = content;
            });
        } else {
            alert('没有提取到文章内容');
        }
    });
});


document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('publishButton').addEventListener('click', async () => {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').innerHTML;
        const selectedPlatforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(el => {
            const platformValue = el.value;
            const platformLabel = document.querySelector(`label[for="${el.id}"]`).textContent;
            return {
                value: platformValue,
                label: platformLabel
            };
        });

        const loadingLayer = document.getElementById('loadingLayer');
        const loadingText = document.getElementById('loadingText');
        loadingLayer.classList.remove('hidden');

        const statusUpdates = [];
        for (const platform of selectedPlatforms) {
            try {
                loadingText.textContent = `正在同步到 ${platform.label}...`;
                await syncManager.syncPost(platform.value, { post_title: title, post_content: content });
                statusUpdates.push({
                    platform: platform.label,
                    status: 'success',
                    message: `成功`,
                    title: title
                });
            } catch (error) {
                statusUpdates.push({
                    platform: platform.label,
                    status: 'failed',
                    message: error.message,
                    title: title
                });
            }
        }
        chrome.storage.local.set({ syncStatus: statusUpdates }, () => {
            // window.close()
            loadingText.textContent = '同步任务结束！';
            loadingLayer.classList.add('hidden');
            alert('同步完成！')
        });
    });
});


function addPromotion(content) {
    const params = new URLSearchParams(window.location.search);
    const currentUrl = params.get('currentUrl');
    var sharcode = `<blockquote><p>本文使用 <a href="https://github.com/iAJue/Articlesync" target="_blank">文章同步助手</a> 同步.原文地址: <a target="_blank" href="${currentUrl}">${currentUrl}</a></p></blockquote>`
    return content.trim() + `${sharcode}`
}

// 获取文章内容
function getArticleContent() {
    const content = document.getElementById("content").innerHTML;
    return content;
}

// 1. HTML 转 Markdown
function handleHtmlToMarkdown() {
    const htmlContent = getArticleContent();
    const markdownContent = htmlToMarkdown(htmlContent);
    document.getElementById("content").innerHTML = markdownContent;
}

// 2. HTML 转 纯文本
function handleHtmlToText() {
    const htmlContent = getArticleContent();
    const textContent = htmlToText(htmlContent);
    document.getElementById("content").innerText = textContent;
}

// 3. Markdown 转 HTML
function handleMarkdownToHtml() {
    const markdownContent = getArticleContent();
    const htmlContent = markdownToHtml(markdownContent);
    document.getElementById("content").innerHTML = htmlContent;
}

// 事件绑定到按钮
document.getElementById("htmlToMarkdown").addEventListener("click", handleHtmlToMarkdown);
document.getElementById("htmlToText").addEventListener("click", handleHtmlToText);
document.getElementById("markdownToHtml").addEventListener("click", handleMarkdownToHtml);