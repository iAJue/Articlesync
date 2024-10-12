import { Readability } from '@mozilla/readability';

// 提取文章的函数
export function extractArticle() {
    const docClone = document.cloneNode(true);
    const reader = new Readability(docClone);
    const article = reader.parse();

    if (article) {
        console.log('文章提取成功:', article);
        return {
            title: article.title,
            content: article.content
        };
    } else {
        console.error('无法提取文章');
        return null;
    }
}