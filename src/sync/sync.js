import syncManager from '../core/syncManager';

document.addEventListener('DOMContentLoaded', async () => {
    // 动态加载支持的平台
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
    } else {
        platformsContainer.innerHTML = '<p>没有可用的平台</p>';
    }

    // 从存储中加载文章数据
    chrome.storage.local.get(['article'], (result) => {
        if (result.article) {  // 确保获取的是 article 对象
            console.log('文章数据:', result.article);
            document.getElementById('title').value = result.article.title || "无标题";
            document.getElementById('content').innerHTML = result.article.content || "无内容";
        } else {
            console.log('没有提取到文章内容');
        }
    });



});

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('publishButton').addEventListener('click', async () => {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').innerHTML;

        // 获取选中的平台
        const selectedPlatforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(el => el.value);

        const statusUpdates = []; // 用于保存同步状态

        for (const platform of selectedPlatforms) {
            try {
                // 调用 syncManager 进行发布
                await syncManager.syncPost(platform, { post_title: title, post_content: content });
                console.log(`成功同步到 ${platform}`);

                // 记录成功状态
                statusUpdates.push({
                    platform,
                    status: 'success',
                    message: `成功同步到 ${platform}`
                });
            } catch (error) {
                console.error(`同步到 ${platform} 失败:`, error);

                // 记录失败状态
                statusUpdates.push({
                    platform,
                    status: 'failed',
                    message: `同步到 ${platform} 失败`
                });
            }
        }

        // 将状态保存到 chrome.storage.local
        chrome.storage.local.set({ syncStatus: statusUpdates }, () => {
            console.log('同步状态已保存');
        });

        alert('同步完成！');
    });
});