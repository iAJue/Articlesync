import adapters from '../adapters/adapters'; 

document.addEventListener('DOMContentLoaded', function () {
    loadAccounts(); 
    loadSyncStatus(); 
});

document.getElementById('status-tab').addEventListener('click', function () {
    switchTab('status');
});
document.getElementById('account-tab').addEventListener('click', function () {
    switchTab('account');
});
document.getElementById('about-tab').addEventListener('click', function () {
    switchTab('about');
});

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));
    document.getElementById(`${tab}-tab`).classList.add('active');
    document.getElementById(`${tab}-content`).classList.remove('hidden');
}

// 加载同步状态并显示在状态区域
function loadSyncStatus() {
    chrome.storage.local.get(['syncStatus'], (result) => {
        const statusContainer = document.getElementById('task-status');
        statusContainer.innerHTML = '';

        const syncStatus = result.syncStatus || [];

        if (syncStatus.length > 0) {
            syncStatus.forEach((task) => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                const taskTitle = document.createElement('span');
                taskTitle.classList.add('task-title');
                taskTitle.textContent = `${task.platform}: ${task.title}`;
                const taskStatus = document.createElement('span');
                taskStatus.classList.add('task-status');
                taskStatus.textContent = task.status === 'success' ? '成功' : '失败';
                taskStatus.classList.add(task.status);
                taskItem.appendChild(taskTitle);
                taskItem.appendChild(taskStatus);
                statusContainer.appendChild(taskItem);
            });
        } else {
            statusContainer.innerHTML = '<p>暂无同步任务!</p>';
        }
    });
}

async function loadAccounts() {
    const accountList = document.getElementById('account-list');
    accountList.innerHTML = '';

    for (const adapter of adapters) {
        try {
            const accountData = await adapter.getMetaData();
            const accountItem = document.createElement('div');
            accountItem.classList.add('task-item');

            const platformIcon = document.createElement('img');
            platformIcon.src = accountData.icon;
            platformIcon.alt = accountData.displayName;
            platformIcon.style.width = '24px';

            const accountName = document.createElement('span');
            accountName.textContent = accountData.title;

            accountItem.appendChild(platformIcon);
            accountItem.appendChild(accountName);
            accountList.appendChild(accountItem);
        } catch (error) {
            console.error(`加载 ${adapter.name} 账号信息失败：`, error);
        }
    }
}

document.getElementById('group-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://jq.qq.com/?_wv=1027&k=5cvR0GN' });
})
document.getElementById('feedback-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/iAJue/Articlesync/issues' });
})
document.getElementById('clear-btn').addEventListener('click', () => {
    chrome.storage.local.clear();
    document.getElementById('task-status').innerHTML = '<p>暂无同步任务!</p>';
})