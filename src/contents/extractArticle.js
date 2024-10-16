import TurndownService from 'turndown';
import { marked } from 'marked';
import { Readability } from '@mozilla/readability';

// 初始化 TurndownService
const turndownService = new TurndownService();

// 提取文章的函数
export function extractArticle() {
    const docClone = document.cloneNode(true);
    const reader = new Readability(docClone);
    const article = reader.parse();

    if (article) {
        return {
            title: article.title,
            content: article.content
        };
    } else {
        console.error('无法提取文章');
        return null;
    }
}

// 1. HTML 转 Markdown
export function htmlToMarkdown(htmlContent) {
    const markdownContent = turndownService.turndown(htmlContent);
    return markdownContent;
}

// 2. HTML 转 纯文本
export function htmlToText(htmlContent) {
    // 替换 <br> 和 <p> 标签为换行符
    let textContent = htmlContent.replace(/<br\s*\/?>/gi, '\n');
    textContent = textContent.replace(/<\/p>/gi, '\n');

    // 替换多个连续的空格为单个空格，或保留缩进
    textContent = textContent.replace(/&nbsp;/g, ' ');
    
    // 去除其他 HTML 标签，但保留文本
    textContent = textContent.replace(/<[^>]*>/g, '');
    
    return textContent;
}

// 3. Markdown 转 HTML
export function markdownToHtml(markdownContent) {
    const htmlContent = marked(markdownContent);
    return htmlContent;
}