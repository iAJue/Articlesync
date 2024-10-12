import syncManager from '../core/syncManager';

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
            document.getElementById('content').innerHTML = result.article.content || "无内容";
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
        
        const statusUpdates = []; 
        for (const platform of selectedPlatforms) {
            try {
                await syncManager.syncPost(platform.value, { post_title: title, post_content: content });
                statusUpdates.push({
                    platform: platform.label, 
                    status: 'success',
                    message: `成功同步到 ${platform.label}`,
                    title: title
                });
            } catch (error) {
                statusUpdates.push({
                    platform: platform.label,
                    status: 'failed',
                    message: `同步到 ${platform.label} 失败`,
                    title: title
                });
            }
        }
        chrome.storage.local.set({ syncStatus: statusUpdates }, () => {
            console.log('同步状态已保存');
            // window.close();
        });
        alert('同步结束！');
    });
});